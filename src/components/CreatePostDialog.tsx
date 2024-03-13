import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

export type PostForm = {
   title: string
   description: string
}

export const CreatePostDialog = () => {
   const onSubmitData = async (form: PostForm) => {
      await fetch('/posts', {
         method: "POST",
         body: JSON.stringify(form)
      })
      setOpen(false)
   }

   const queryClient = useQueryClient()
   const {mutate, isPending} = useMutation({
      mutationFn: onSubmitData,
      onSuccess: () => {
         queryClient.invalidateQueries({queryKey: ['posts']})
      }
   })

   const [open, setOpen] = useState(false)
   const [form, setForm] = useState<PostForm>({
      title: "",
      description: ""
   })

   const onFieldChange = (field: string, data: string) => {
      setForm(old => ({
         ...old,
         [field]: data
      }))
   }
   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button>Novo post</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Criar Post</DialogTitle>
               <DialogDescription>
                  Adicione o titulo e a descrição do Post
               </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4 py-4">
               <Input
                  id="title"
                  placeholder="Titulo"
                  value={form.title}
                  onChange={(e) => onFieldChange("title", e.target.value)}
               />
               <Textarea
                  id="description"
                  placeholder="Descrição"
                  value={form.description}
                  onChange={(e) => onFieldChange("description", e.target.value)}

               />
            </form>
            <DialogFooter>
               <Button disabled={isPending} onClick={() => mutate(form)} type="submit">Salvar</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}