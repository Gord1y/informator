'use client'

import Hls from 'hls.js'
import React, { useEffect, useRef, useState } from 'react'

interface Props {
  streamKey: string
}

const LIVE_OFFSET = 2

const StreamPlayer: React.FC<Props> = ({ streamKey }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [playInProgress, setPlayInProgress] = useState<boolean>(false)

  const hlsUrl = `${process.env.NEXT_PUBLIC_HLS_API_URL}/${streamKey}.m3u8`

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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setIsLoading(true)
    setError(null)

    const onManifestParsed = () => {
      setIsLoading(false)
      if (video.seekable.length) {
        const liveEdge = video.seekable.end(video.seekable.length - 1)
        if (liveEdge - video.currentTime > LIVE_OFFSET) {
          video.currentTime = liveEdge - LIVE_OFFSET
        }
      }
      video.play().catch(error => {
        //eslint-disable-next-line no-console
        console.error('Error playing stream:', error)
        setError('Playback error occurred. Please reload the page.')
      })
    }

    let hls: Hls | null = null

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl
      video.addEventListener('loadeddata', onManifestParsed)
    } else if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(hlsUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed)
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          //eslint-disable-next-line no-console
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

  const handlePlayPause = async () => {
    if (playInProgress) return
    const video = videoRef.current
    if (!video) return

    setPlayInProgress(true)
    try {
      if (isPlaying) {
        video.pause()
      } else {
        if (video.seekable.length) {
          const liveEdge = video.seekable.end(video.seekable.length - 1)
          if (liveEdge - video.currentTime > LIVE_OFFSET) {
            video.currentTime = liveEdge - LIVE_OFFSET
          }
        }
        await video.play()
      }
    } catch (err) {
      //eslint-disable-next-line no-console
      console.error('Playback error:', err)
      setError('Playback error occurred. Please try reloading the page.')
    }
    setPlayInProgress(false)
  }

  const toggleFullScreen = () => {
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        //eslint-disable-next-line no-console
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
