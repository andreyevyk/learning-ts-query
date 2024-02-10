import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { debounce } from "@/core/debounce"
import { PostResponse } from "@/mocks/handlers"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { FiHeart, FiMessageSquare, FiSearch, FiShare } from "react-icons/fi"
import { Link } from "react-router-dom"



const fetchPosts = (search: string, page: number):Promise<PostResponse> => {
  return fetch('/posts?' + new URLSearchParams({
      search,
      page: page.toString()
    })
  ).then(res => res.json())
}

export function Home() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const { isFetching, isError, data, error, isPlaceholderData } = useQuery({ 
    queryKey: ['posts', search, page], 
    queryFn: () => fetchPosts(search, page),
    placeholderData: keepPreviousData,
  })


  const debouncedSearch = debounce(
    (value: string) => setSearch(value) , 500
  )
    
  if (isError) {
    return <span>Error: {error.message}</span>
  }


  return (
    <main className="mt-4 max-w-[1180px] mx-auto">
      <header className="flex  w-full justify-between items-center mb-8">
        <Input
          onChange={(e) => debouncedSearch(e.target.value)}
          leftIcon={<FiSearch />} 
          placeholder="Pesquisa..." 
          className="w-full max-w-[400px]"
        />
        <Button>Novo post</Button>
      </header>
      <div className="grid grid-cols-3 gap-8 max-w-[1170px] mx-auto">
        {isFetching ? (
          [1,2,3,4,5,6].map(i => (
            <Skeleton key={i} className="h-[380px] w-[380px] rounded-xl" />
          ))
          ) : data?.items.map((post) => (
            <Link to={`${post.id}`}>
              <Card className="max-w-[370px] rounded-2xl" >
                <CardHeader>
                  <img className="object-cover w-full h-[260px]" src={post.img} />
                  <div className="flex justify-between">
                    <CardDescription>{new Date(post.updatedAt).toLocaleDateString()}</CardDescription>
                    <div className="flex gap-3">
                      <CardDescription className="flex gap-1 items-center"><FiHeart/> {post.likes}</CardDescription>
                      <CardDescription className="flex gap-1 items-center"><FiMessageSquare /> {post.messages}</CardDescription>
                      <CardDescription className="flex gap-1 items-center"><FiShare/> {post.shares}</CardDescription>
                    </div>
                  </div>
                  <CardTitle>{post.title}</CardTitle>     
                </CardHeader>              
                <CardContent>{post.description}</CardContent>         
              </Card>
            </Link>
          ))
        }
      </div>
      {!isFetching && (
        <Pagination className="my-4">
          <PaginationContent>
            <PaginationItem 
              onClick={() => setPage(old => old - 1)}
            >
              <PaginationPrevious disabled={page === 0} />
            </PaginationItem>
            {Array.from({ length: data!.paging.totalPages }, (_, i) => (
              <PaginationItem onClick={() => setPage(i)} key={i}>
                <PaginationLink disabled={i === page}>{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem 
              onClick={() => setPage(old => old + 1)}
            >
              <PaginationNext disabled={data && (isPlaceholderData  || (data.paging.totalPages - 1) === page)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </main>
  )
}

