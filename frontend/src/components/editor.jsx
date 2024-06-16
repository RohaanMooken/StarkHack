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
                class: "border-white border-2 rounded-lg p-4",
            },
        },
	});
	
	return (
		<div className="w-6/12">
			<EditorToggleBar editor={editor}/>
            <EditorContent editor={editor}/>
		</div>
	);
}