import { Search } from "lucide-react"
import { useState } from "react"

import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"

interface SearchFormProps extends React.ComponentProps<"form"> {
  onSearch?: (query: string) => void
}

export function SearchForm({ onSearch, ...props }: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    // Gerçek zamanlı arama için
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Ara
          </Label>
          <SidebarInput
            id="search"
            placeholder="Menüde ara..."
            className="pl-8"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
