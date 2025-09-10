import logo from "../assets/images/oyo-logo.png"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <span className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent h-8 w-8 inline-block" />
      <span className="ml-3 text-blue-700 font-medium">Loading...</span>
    </div>
  )
}

export const ComponentLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <img
              src={logo}
              alt="Oyo Logo"
              className="h-24 w-24 z-10"
              style={{ borderRadius: '50%' }}
            />
            <span
              className="absolute inset-0 rounded-full animate-ping bg-[#700002]/30 opacity-30"
              style={{
                zIndex: 1,
                display: 'block',
              }}
            ></span>
          </div>
          <span className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Loading...</span>
        </div>
      </div>
  )
}
