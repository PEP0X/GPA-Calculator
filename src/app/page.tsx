import GPACalculator from "./gpa-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-grow">
        <div className="container py-8">
          <GPACalculator />
        </div>
      </div>
      <footer className="py-6 border-t bg-muted/20">
        <div className="container text-center text-sm text-muted-foreground">
          Made with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/pep0x/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Abanoub Nashaat
          </a>
        </div>
      </footer>
    </main>
  )
}