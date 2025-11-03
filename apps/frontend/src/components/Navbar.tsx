import Link from "next/link"
import { Moon } from "lucide-react"


const Navbar = () => {
  return (
    <nav className="p-4 flex items-center justify-between">
      
      <div className="flex items-center gap-4">
        <Link href="/">Dashboard</Link>
        <Moon />
      </div>
    </nav>
  )
}

export default Navbar
