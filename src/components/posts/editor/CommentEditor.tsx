"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import "./styles.css";
import { useSubmitCommentMutation } from "./mutation";
import LoadingButton from "@/components/LoadingButton";
import { SendHorizonal } from "lucide-react";

const CommentEditor = () => {
  const { user } = useSession();

  const mutation = useSubmitCommentMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Leave a comment..",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  async function onSubmit() {
    mutation.mutate(input, {
      onSuccess: () => {
        editor?.commands.clearContent();
      },
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl">
      <div className="flex gap-5">
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full rounded-2xl bg-slate-50 px-5 py-2"
        />
        <div className="flex items-center justify-end">
          <LoadingButton
            onClick={onSubmit}
            disabled={!input.trim()}
            loading={mutation.isPending}
            className="min-w-10"
          >
            <SendHorizonal size={15} />
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default CommentEditor;
