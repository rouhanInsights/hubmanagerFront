import { SignUp } from "@/components/signup-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section (30%) - Background Image with Heading & Text */}
      <div
        className="w-2/4 flex items-center justify-center p-10 text-white"
        style={{
          backgroundImage: "url('/home/image (6).jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black/50 p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">Join Speech Fix</h1>
          <p className="text-sm mt-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>

      {/* Right Section (70%) - SignUp Form */}
      <div className="w-2/4 flex items-center justify-center">
        <div className="w-full max-w-2xl ml-10"> {/* Shift form slightly to the right */}
          <SignUp />
        </div>
      </div>
    </div>
  )
}
