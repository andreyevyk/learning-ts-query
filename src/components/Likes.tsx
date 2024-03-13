import { FiHeart, FiLoader } from "react-icons/fi"
import { Button } from "./ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"

interface LikesProps {
   quantity: number
   postId: number
}

export const Likes = ({ quantity, postId }:LikesProps) => {
   const queryClient = useQueryClient()

   const { mutate, isPending } =  useMutation({
      mutationFn: () => fetch(`/posts/${postId}/like`, {
         method: "PATCH"
      }),
      onSuccess: () => {
         console.log('likes', ['post', postId])
         queryClient.invalidateQueries({ queryKey: ['posts']})
         queryClient.invalidateQueries({ queryKey: ['post', postId]})
      }
   })

   const onLike = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      mutate()
   }

   

   return (
      <Button disabled={isPending} onClick={(e) => onLike(e)} variant="ghost" className="flex gap-1 items-center">
         {isPending ? <FiLoader className="animate-spin" /> : <FiHeart size={18}/>}
          {quantity}
      </Button>
   )
}