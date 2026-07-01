"use client"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Not Found</h2>
      <p className="text-muted-foreground mb-6">Could not find requested page</p>
      <a href="/" className="text-primary hover:underline">
        Return Home
      </a>
    </div>
  )
}