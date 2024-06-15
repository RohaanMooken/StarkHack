"use client"

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorToggleBar } from "@/components/editorToggleBar";

export function Editor() {
    const editor = useEditor({
		extensions: [
			StarterKit,
		],
        editorProps: {
            attributes: {
                class: "border-white border-2 rounded-lg",
            },
        },
	});

	return (
		<div className="w-full">
			<EditorToggleBar editor={editor}/>
            <EditorContent editor={editor}/>
		</div>
	);
}