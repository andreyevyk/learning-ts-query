import { Likes } from "@/components/Likes"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CommentResponse, IPost } from "@/mocks/handlers"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import React from "react"
import { FiLoader } from "react-icons/fi"
import { useParams } from "react-router-dom"

 
const fetchPost = (id: number):Promise<IPost> => {
   return fetch(`/posts/${id}`).then(res => res.json())
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchComments = ({ queryKey, pageParam }: any):Promise<CommentResponse> => {
   const [, id] = queryKey

   return fetch(`/posts/${id}/comments?cursor=` + pageParam).then(res => res.json())
}


export const Post = () => {
   const { id } = useParams<{id: string}>()
   const parsedId = Number(id)
   const { isFetching, isError, data } = useQuery({ 
      queryKey: ['post', parsedId], 
      queryFn: () => fetchPost(parsedId)
   })
   
   const {
      data: dataComments,
      fetchNextPage,
      hasNextPage,
      isPending: isCommentsPending,
      isFetchingNextPage,
   } = useInfiniteQuery({
      queryKey: ['comments', parsedId],
      queryFn: fetchComments,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
   })

   if(isError) return <div>Error...</div>

   return (
       <div className="mx-auto max-w-[970px]">
         <header className="flex flex-col pb-8 border-b border-gray-200">
            {isFetching ? <Skeleton className="w-[970px] h-[380px]" /> : <img className="w-[970px] h-[380px] object-cover" src={data?.img} />}
            <div className="mt-10">
               <h1 className="text-4xl font-bold">{data?.title}</h1>
               <div className="flex gap-10 mt-5 items-center">
                  <span>{data && new Date(data.updatedAt).toLocaleDateString()}</span>
                  <div className="flex gap-3">
                     { isFetching ? [1,2,3].map(i => <Skeleton key={i} className="w-10 h-10" />) :  (
                        <Likes postId={data!.id} quantity={data!.likes} />
                     )}
                  </div>
               </div>
            </div>
         </header>
         <main>
            {isFetching ? Array.from({ length: 10 }).map((_, i) => (
               <Skeleton key={i} className="w-full h-10 mt-2" />
            )) : (
               <p className="text-lg mt-10 text-gray-500">{data?.text}</p>
            )}
         </main>
         <footer className="flex flex-col my-4 p-4 bg-gray-50 gap-4 rounded-xl">
            {isCommentsPending && !isFetchingNextPage ? (
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
            <Button disabled={!hasNextPage || isCommentsPending || isFetchingNextPage} onClick={() => fetchNextPage()}>
               {isFetchingNextPage ? <FiLoader className="animate-spin" /> : "Carregar mais"}
            </Button>
         </footer>
       </div>
   )
}  