import { MessageData, MongoArticle, MongoUser } from "../../utils/types"
import { useRef } from "react"
import { useParams } from "react-router-dom"
import { createMessage } from "../../redux/messageSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { resetState } from "../../redux/messageSlice"
import { AppDispatch, RootState } from "../../redux/store"
import { toast } from "react-toastify"
import { AsyncThunkAction } from "@reduxjs/toolkit"

interface Props {
  user: MongoUser | null
  actionType: string
  // actionFn: AsyncThunkAction<any, MessageData, {}>
}

export default function CommentForm({ user, actionType }: Props) {
  const textareaRef = useRef<any>()
  const dispatch = useDispatch<AppDispatch>()
  const { slug } = useParams()
  const { articles } = useSelector((state: RootState) => state.article)
  const article = articles.find((a: MongoArticle) => a.slug === slug)
  const {
    messageLoading,
    messageAction,
    messageSuccess,
    messageError,
    messageMsg,
  } = useSelector((state: RootState) => state.message)

  useEffect(() => {
    if (messageAction === actionType) {
      if (messageSuccess) {
        dispatch(resetState())
        textareaRef.current.value = ""
      }
      if (messageError) {
        toast(messageMsg, { type: "error", autoClose: 2300 })
        dispatch(resetState())
      }
    }
  }, [
    messageAction,
    messageSuccess,
    messageError,
    messageMsg,
    actionType,
    dispatch,
  ])

  function createComment(e: any) {
    e.preventDefault()
    const comment = textareaRef.current.value
    if (!comment || !user || !article) return
    const messageData = {
      message: comment,
      senderId: user._id,
      articleId: article._id,
    }
    dispatch(createMessage(messageData))
  }

  return (
    <form className="flex mt-4 gap-6 p-10 rounded-xl justify-between items-start bg-[#f6f6f6]">
      <img
        src={user?.imgUrl}
        alt="user"
        className="w-20 min-w-[5rem] h-20 object-cover rounded-full"
      />
      <textarea
        ref={textareaRef}
        placeholder="Add a comment"
        className="w-full resize-none h-48 bg-white px-8 py-5 rounded-lg text-2xl text-gray-500 border border-gray-300 border-solid focus:border-gray-800 transition-all duration-200"
      ></textarea>
      <input
        onClick={createComment}
        type="submit"
        value="SEND"
        className={`${
          messageAction === actionType && messageLoading
            ? "bg-violet-500 pointer-events-none"
            : "bg-violet-700 shadow-lg shadow-violet-300 hover:shadow-none hover:bg-gray-800"
        } rounded-xl transition-all duration-300 text-white text-2xl capitalize font-medium py-6 px-16 cursor-pointer tracking-wider`}
      />
    </form>
  )
}