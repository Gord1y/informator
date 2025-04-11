'use client'

import Hls from 'hls.js'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  streamKey: string
}

const LIVE_OFFSET = 2 // seconds offset from the live edge

const StreamPlayer: React.FC<Props> = ({ streamKey }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [playInProgress, setPlayInProgress] = useState<boolean>(false)

  const hlsUrl = `${process.env.NEXT_PUBLIC_HLS_API_URL}/${streamKey}.m3u8`

  // Synchronize the isPlaying state with native play/pause events.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  // Setup HLS stream and auto-play as soon as manifest is parsed.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setIsLoading(true)
    setError(null)

    const onManifestParsed = () => {
      setIsLoading(false)
      if (video.seekable.length) {
        const liveEdge = video.seekable.end(video.seekable.length - 1)
        // Only adjust the currentTime if behind the live edge by more than LIVE_OFFSET.
        if (liveEdge - video.currentTime > LIVE_OFFSET) {
          video.currentTime = liveEdge - LIVE_OFFSET
        }
      }
      // Auto-play the stream immediately.
      video.play().catch(error => {
        console.error('Error playing stream:', error)
        setError('Playback error occurred. Please reload the page.')
      })
    }

    let hls: Hls | null = null

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Use native HLS support.
      video.src = hlsUrl
      video.addEventListener('loadeddata', onManifestParsed)
    } else if (Hls.isSupported()) {
      // Use Hls.js for browsers that do not have native support.
      hls = new Hls()
      hls.loadSource(hlsUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed)
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('HLS fatal error:', data)
          setError('Error loading stream. Please reload the page.')
        }
      })
    } else {
      setError('HLS is not supported in your browser.')
    }

    return () => {
      if (hls) hls.destroy()
    }
  }, [hlsUrl])

  // Pause the video when the document is hidden (for example, when switching tabs).
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        videoRef.current?.pause()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Play/Pause toggle button with debouncing to prevent rapid successive clicks.
  const handlePlayPause = async () => {
    if (playInProgress) return
    const video = videoRef.current
    if (!video) return

    setPlayInProgress(true)
    try {
      if (isPlaying) {
        video.pause()
      } else {
        // Only adjust the position if we're noticeably behind the live edge.
        if (video.seekable.length) {
          const liveEdge = video.seekable.end(video.seekable.length - 1)
          if (liveEdge - video.currentTime > LIVE_OFFSET) {
            video.currentTime = liveEdge - LIVE_OFFSET
          }
        }
        await video.play()
      }
    } catch (err) {
      console.error('Playback error:', err)
      setError('Playback error occurred. Please try reloading the page.')
    }
    setPlayInProgress(false)
  }

  // Toggle full-screen mode.
  const toggleFullScreen = () => {
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Error enabling full-screen mode:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const reloadPage = () => {
    window.location.reload()
  }

  return (
    <div className='w-full'>
      {error ? (
        <div className='mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700'>
          <p>{error}</p>
          <button
            onClick={reloadPage}
            className='mt-2 rounded bg-red-500 px-4 py-2 text-white'
          >
            Reload Page
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          className='relative h-fit min-h-[50vh] w-full overflow-hidden bg-black'
        >
          {/* 
          Auto-play is enabled by adding autoPlay and muted attributes.
          Muting is required for auto-play in most browsers.
        */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className='h-full w-full object-cover'
          />
          {isLoading && !error && (
            <div className='bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black'>
              <div className='text-lg text-white'>Loading...</div>
            </div>
          )}
          <div className='absolute bottom-4 left-4 z-20 flex space-x-4'>
            <button
              onClick={handlePlayPause}
              disabled={playInProgress}
              className='rounded bg-gray-700 px-4 py-2 text-white focus:outline-none disabled:opacity-50'
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={toggleFullScreen}
              className='rounded bg-gray-700 px-4 py-2 text-white focus:outline-none'
            >
              FullScreen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StreamPlayer
