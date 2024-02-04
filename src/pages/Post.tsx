import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CommentResponse, IPost } from "@/mocks/handlers"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import React from "react"
import { FiHeart, FiLoader, FiMessageSquare, FiShare } from "react-icons/fi"
import { useParams } from "react-router-dom"

 
const fetchPost = (id: string):Promise<IPost> => {
   return fetch(`/posts/${id}`).then(res => res.json())
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchComments = ({ pageParam }: any, id: string):Promise<CommentResponse> => {
   return fetch(`/posts/${id}/comments?cursor=` + pageParam).then(res => res.json())
}


export const Post = () => {
   const { id } = useParams<{id: string}>()

   const { isPending, isError, data } = useQuery({ 
      queryKey: ['post', id], 
      queryFn: () => fetchPost(id!)
   })

   const {
      data: dataComments,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
    } = useInfiniteQuery({
      queryKey: ['comments', id],
      queryFn: (cursor) => fetchComments(cursor, id!),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
  

   if(isPending) return <div>Loading...</div>
   
   if(isError || !data) return <div>Error...</div>

   return (
       <div className="mx-auto max-w-[970px]">
         <header className="flex flex-col pb-8 border-b border-gray-200">
            <img className="w-[970px] h-[380px] object-cover" src={data.img} />
            <div className="mt-10">
               <h1 className="text-4xl font-bold">{data.title}</h1>
               <div className="flex gap-10 mt-5">
                  <span>{new Date(data.updatedAt).toLocaleDateString()}</span>
                  <div className="flex gap-3">
                     <span className="flex gap-1 items-center"><FiHeart/> {data.likes}</span>
                     <span className="flex gap-1 items-center"><FiMessageSquare /> {data.messages}</span>
                     <span className="flex gap-1 items-center"><FiShare/> {data.shares}</span>
                  </div>
               </div>
            </div>
         </header>
         <main>
            <p className="text-lg mt-10 text-gray-500">{data.text}</p>
         </main>
         <footer className="flex flex-col my-4 p-4 bg-gray-50 gap-4 rounded-xl">
            {isFetching && !isFetchingNextPage ? (
               [1,2].map((i) => (
                  <Skeleton key={i} className="rounded-xl w-full h-[100px]" />
               ))) 
            : dataComments?.pages.map((group, i) => (
               <React.Fragment key={i}>
                  {group.items.map((comment) => (
                     <div key={comment.id} className="bg-white p-4 rounded-lg flex flex-col gap-2">
                        <div className="flex items-end gap-3">
                           <img className="w-[35px] h-[35px] rounded-xl" src={comment.userImg} />
                           <h2 className="text-sm font-bold">{comment.userName}</h2>
                        </div>
                        <p className="text-md">{comment.text}</p>
                     </div>
                  ))}
               </React.Fragment>
            ))}
            <Button disabled={!hasNextPage || isFetching} onClick={() => fetchNextPage()}>
               {isFetchingNextPage ? <FiLoader className="animate-spin" /> : "Carregar mais"}
            </Button>
         </footer>
       </div>
   )
}