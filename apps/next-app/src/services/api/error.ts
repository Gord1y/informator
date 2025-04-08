// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorCatch = (error: any) => {
  return (
    error?.response?.data?.message?.message ||
    error?.response?.data?.message ||
    error?.message ||
    'error'
  )
}
