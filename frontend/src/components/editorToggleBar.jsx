"use client";

import {
	Bold,
	Italic,
	Strikethrough,
    List,
    ListOrdered,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

export function EditorToggleBar({ editor }) {
	if (!editor) return null;

	const [value, setValue] = useState(null);

	function switchValue(value) {
		switch (value) {
			case "bold":
				editor.chain().focus().toggleBold().run();
				break;
			case "italic":
				editor.chain().focus().toggleItalic().run();
				break;
			case "strikethrough":
				editor.chain().focus().toggleStrike().run();
				break;
			case "h1":
				editor.chain().focus().toggleHeading({ level: 1 }).run();
				break;
			case "h2":
				editor.chain().focus().toggleHeading({ level: 2 }).run();
				break;
			case "h3":
				editor.chain().focus().toggleHeading({ level: 3 }).run();
				break;
            case "bulletlist":
                editor.chain().focus().toggleBulletList().run();
                break;
            case "orderedlist":
                editor.chain().focus().toggleOrderedList().run();
                break;
			default:
				break;
		}
	}

	function onChange(val) {
		switchValue(value);
		setValue(val);
		switchValue(val);
	}

	return (
		<ToggleGroup
			type="single"
			value={value}
			onValueChange={(value) => {
				onChange(value);
			}}
		>
			<ToggleGroupItem value="h1">H1</ToggleGroupItem>
			<ToggleGroupItem value="h2">H2</ToggleGroupItem>
			<ToggleGroupItem value="h3">H3</ToggleGroupItem>
			<ToggleGroupItem value="bold">
				<Bold className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="italic">
				<Italic className="h-4 w-4" />
			</ToggleGroupItem>
			<ToggleGroupItem value="strikethrough">
				<Strikethrough className="h-4 w-4" />
			</ToggleGroupItem>
            <ToggleGroupItem value="bulletlist">
				<List className="h-4 w-4" />
			</ToggleGroupItem>
            <ToggleGroupItem value="orderedlist">
				<ListOrdered className="h-4 w-4" />
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
