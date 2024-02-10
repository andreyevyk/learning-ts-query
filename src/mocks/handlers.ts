// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { randomDate } from '@/core/randomDate'
import { delay, http, HttpResponse } from 'msw'
import {faker} from '@faker-js/faker'

const getPosts = () => [ 
   { 
      id: 1, 
      img: "/post-2.png", 
      updatedAt: randomDate(new Date(2021, 0, 1), new Date()),
      likes: Math.ceil(Math.random() * 10),
      shares: Math.ceil(Math.random() * 10),
      messages: Math.ceil(Math.random() * 10),
      title: '10 dicas para conseguir a vaga desejada', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique. '
   }, 
   { 
      id: 2, 
      img: "/post-6.png", 
      updatedAt: randomDate(new Date(2021, 0, 1), new Date()),
      likes: Math.ceil(Math.random() * 10),
      shares: Math.ceil(Math.random() * 10),
      messages: Math.ceil(Math.random() * 10),
      title: 'Deixe seu código mais semântico com essas dicas', 
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique.'
   }, 
   { 
      id: 3,
      img: "/post-4.png", 
      updatedAt: randomDate(new Date(2021, 0, 1), new Date()),
      likes: Math.ceil(Math.random() * 10),
      shares: Math.ceil(Math.random() * 10),
      messages: Math.ceil(Math.random() * 10),
      title: 'Use essas dicas nas suas aplicações mobile', 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique."
   },
   { 
      id: 4,
      img: "/post-7.png", 
      updatedAt: randomDate(new Date(2021, 0, 1), new Date()),
      likes: Math.ceil(Math.random() * 10),
      shares: Math.ceil(Math.random() * 10),
      messages: Math.ceil(Math.random() * 10),
      title: 'Stop Using localStorage!', 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique."
   },
   { 
      id: 5,
      img: "/post-8.png", 
      updatedAt: randomDate(new Date(2021, 0, 1), new Date()),
      likes: Math.ceil(Math.random() * 10),
      shares: Math.ceil(Math.random() * 10),
      messages: Math.ceil(Math.random() * 10),
      title: 'Stop using “npm install” in your CI/CD pipeline', 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique."
   },
   { 
      id: 6,
      img: "/post-1.png", 
      updatedAt: randomDate(new Date(2021, 0, 1), new Date()),
      likes: Math.ceil(Math.random() * 10),
      shares: Math.ceil(Math.random() * 10),
      messages: Math.ceil(Math.random() * 10),
      title: 'Use essas dicas nas suas aplicações mobile', 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique."
   },
].sort( () => .5 - Math.random());

export type IComment = {
   id: number
   userImg: string
   userName: string
   text: string
   createdAt: string   
}

export type IPost = {
   id: number
   title: string
   description?: string
   text?: string
   img: string
   updatedAt: string
   likes: number
   shares: number
   messages: number
}

type Paginated<T> = {
   paging: {
      totalPages:number
      page:number
      totalElements:number
   }
   items: T[]
}

export type PostResponse = Paginated<IPost>

type Cursor<T> = {
   nextCursor: number
   items: T[]
}

export type CommentResponse = Cursor<IComment>

const comments = [
   { 
      id: 1, 
      userImg: faker.image.avatarGitHub(),
      userName: faker.person.fullName(),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique.",
      createdAt: randomDate(new Date(2021, 0, 1), new Date())
   },
   { 
      id: 2, 
      userImg: faker.image.avatarGitHub(),
      userName: faker.person.fullName(),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique.",
      createdAt: randomDate(new Date(2021, 0, 1), new Date())
   },
   { 
      id: 3, 
      userImg: faker.image.avatarGitHub(),
      userName: faker.person.fullName(),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique.",
      createdAt: randomDate(new Date(2021, 0, 1), new Date())
   },
   { 
      id: 4, 
      userImg: faker.image.avatarGitHub(),
      userName: faker.person.fullName(),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique.",
      createdAt: randomDate(new Date(2021, 0, 1), new Date())
   },
   { 
      id: 5, 
      userImg: faker.image.avatarGitHub(),
      userName: faker.person.fullName(),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique.",
      createdAt: randomDate(new Date(2021, 0, 1), new Date())
   },
   { 
      id: 6, 
      userImg: faker.image.avatarGitHub(),
      userName: faker.person.fullName(),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nibh eu in aliquet ut adipiscing neque. Sed volutpat aenean sit vitae, sed tristique.",
      createdAt: randomDate(new Date(2021, 0, 1), new Date())
   }
]

export const handlers = [
   http.get(
      '/posts',
      async ({request}) => {
         const posts = getPosts()
         const url = new URL(request.url)
         const search = url.searchParams.get('search')
         const page = url.searchParams.get('page')

         await delay(2000)
         if(search){
            return  HttpResponse.json({
               paging: {
                  totalPages: 1,
                  page: 1,
                  totalElements: 4,
               },
               items: posts.filter(post => post.title.toLowerCase().includes(search.toLowerCase()))
            })
         }
         return HttpResponse.json({
            paging: {
               totalPages: 4,
               page: Number(page),
               totalElements: 6,
            },
            items: posts         
         })
      },
   ),
   http.get(
      '/posts/:id',
      async ({params}) => {
         const { id } = params
         await delay(2000)
         
         return HttpResponse.json({
            ...getPosts().find(post => post.id === Number(id)),
            text: `
               Pellentesque hendrerit urna sed finibus sollicitudin. Donec ac dui justo. In pretium tempus sollicitudin. Donec sagittis cursus rhoncus. Vestibulum felis tellus, suscipit at iaculis eget, molestie auctor justo. Pellentesque enim ligula, mollis eget pretium ut, hendrerit vel nisl. Aenean ultricies nisl id lectus dictum laoreet. Quisque nec sem neque. Cras vulputate tempor facilisis.
               Nam vel enim sed purus consectetur eleifend. Donec sed urna mauris. Mauris ex urna, laoreet a ullamcorper id, placerat sit amet nibh. Vivamus dignissim scelerisque felis, et lacinia mi ultrices pellentesque. Aenean maximus odio metus, id faucibus ligula eleifend a. Nunc porttitor elit non semper rhoncus. Suspendisse interdum gravida felis, sit amet consectetur arcu fringilla vitae. Aenean id leo in felis consequat vulputate. Morbi fermentum pharetra justo, ut iaculis nunc fringilla at. In hac habitasse platea dictumst.
               Vivamus efficitur finibus enim, iaculis blandit sem hendrerit at. Quisque leo urna, porta vel pharetra et, molestie accumsan dolor. Cras ultricies accumsan dolor eu accumsan. Nullam eget tortor neque. Nulla ornare metus elit, ac finibus mi suscipit eu. Donec facilisis magna ut nunc hendrerit, finibus imperdiet ex viverra. Curabitur vestibulum, ligula nec volutpat molestie, dolor purus consequat lacus, et iaculis metus leo id lorem. Suspendisse tincidunt ultrices varius. Sed quis imperdiet tellus. Nulla ante metus, posuere ut eros eget, rutrum varius lacus. Donec non consectetur ante, vitae hendrerit neque. Donec pellentesque auctor odio. Morbi eget metus vestibulum, ullamcorper eros sed, lacinia justo. In feugiat ornare enim eget placerat.
               Vivamus at gravida est. Pellentesque ultrices at lacus non facilisis. Phasellus tincidunt viverra tincidunt. Maecenas euismod eu neque ut consectetur. Aliquam sit amet sem maximus leo fringilla facilisis. Duis pulvinar nibh et erat pretium, ut pharetra felis ultricies. Sed luctus velit vel mauris faucibus tempus. Phasellus ut tellus a ex mattis luctus quis ac risus. Duis tincidunt mollis purus nec gravida. Vestibulum finibus posuere erat, eu pellentesque urna sollicitudin id. Pellentesque nec pulvinar velit, at iaculis odio. Cras et enim sed libero ultricies vulputate. Nunc vestibulum ligula sapien, id feugiat massa efficitur ut. Maecenas faucibus nisl magna, sed ornare lacus faucibus non. Donec molestie rhoncus eleifend.
               Proin consequat pretium interdum. Curabitur et diam ultricies, suscipit sem sed, blandit diam. Aliquam at erat ut ex faucibus blandit. Suspendisse id est sagittis, venenatis mi ac, bibendum est. Cras rutrum mauris eget est mattis accumsan. Curabitur sem nunc, gravida maximus tortor id, elementum euismod diam. Maecenas a mauris pharetra, porta sem a, cursus enim.
               Suspendisse malesuada tellus odio, ac accumsan lorem euismod sed. Quisque sit amet nunc in lorem maximus elementum. Aenean vehicula neque lacus. Aliquam quis rutrum dui, et rutrum nisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam elementum sodales nibh, ac finibus est eleifend sit amet. Morbi posuere elit nisl, in elementum sem blandit at. Nunc facilisis sodales lacus, id commodo metus convallis eu. Morbi dictum vestibulum nisl vitae dapibus. Aliquam id odio non est sodales congue. Nam porta vitae arcu quis feugiat. Proin at mattis est, lobortis eleifend elit. Phasellus ut volutpat nisl, quis facilisis felis. Cras ac velit id erat condimentum facilisis.
               Curabitur id rutrum ante, id feugiat nunc. Cras non tincidunt turpis, in volutpat urna. Aliquam a massa sit amet lacus sodales vestibulum eget non leo. Morbi tincidunt eros quis lacus hendrerit, et gravida ipsum consequat. Nulla facilisi. Integer dictum dui at venenatis convallis. Sed dolor sem, cursus a turpis sit amet, congue aliquet ex. Ut id egestas ante.
            `
         })
      },
   ),
   http.get(
      '/posts/:id/comments',
      async ({request}) => {   
         const url = new URL(request.url)
         const cursor = url.searchParams.get('cursor')  
         const cursorNumber = Number(cursor) || 0  
         await delay(2000)
         
         const pageSize = 2
         
         const nextCursor = cursorNumber + pageSize
         return HttpResponse.json({
            nextCursor: nextCursor < 6 ? nextCursor  : undefined,
            items: comments.slice(cursorNumber, cursorNumber + pageSize)
         })
      },
   ),
]