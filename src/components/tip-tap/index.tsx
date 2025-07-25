'use client'

import './styles.css'
import { useEditor,EditorProvider, useCurrentEditor, EditorContent, Editor, EditorContext } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import {Toggle} from '@/components/ui/toggle';

import { Bold } from "lucide-react"
import { Italic } from "lucide-react"
import { Strikethrough} from "lucide-react"
import { Code } from "lucide-react"
import { Save } from "lucide-react"
import { useState, useContext, useEffect } from 'react'
import { Activity } from '@/actions/activities/types'
import { Button } from '../ui/button'

type TiptapProps = {
    initialContent: string,
    onEditingEnd: (a:string) => void
}


const modes = [
  { key: 'bold', 
    icon: <Bold className="h-4 w-4"/>, 
    click: (editor: Editor) => {editor.chain().focus().toggleBold().run()}, 
    disabled: (editor: Editor) => { return !editor.can().chain().focus().toggleBold().run()} 
  }
  ,
  { key: 'italic', 
    icon: <Italic className="h-4 w-4"/>, 
    click: (editor: Editor) => {editor.chain().focus().toggleItalic().run()}, 
    disabled: (editor: Editor) => { return !editor.can().chain().focus().toggleItalic().run()} 
  }
  ,
  { key: 'strike', 
    icon: <Strikethrough className="h-4 w-4"/>, 
    click: (editor: Editor) => {editor.chain().focus().toggleStrike().run()}, 
    disabled: (editor: Editor) => { return !editor.can().chain().focus().toggleStrike().run()} 
  }
  ,
  { key: 'code', 
    icon: <Code className="h-4 w-4"/>, 
    click: (editor: Editor) => {editor.chain().focus().toggleCode().run()}, 
    disabled: (editor: Editor) => { return !editor.can().chain().focus().toggleCode().run()} 
  }
]

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return <div className="control-group">
      <div className="button-group gap-2 flex flex-row">
        
  {
    modes.map(((m, i)=> (
      <Toggle
        key={i}
        onClick={()=> m.click(editor)}
        disabled={m.disabled(editor)}
        pressed={editor.isActive(m.key)}
      
      >
        {m.icon}
      </Toggle>
    )))
  }
      </div>
      </div>
}

const MenuBar2 = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }

          className={editor.isActive('italic') ? 'bg-red-400' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          className={editor.isActive('code') ? 'is-active' : ''}
        >
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          Redo
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        >
          Purple
        </button>
      </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ mergeNestedSpanStyles: true }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`

export default ({initialContent, onEditingEnd}:TiptapProps) => {

  const [content, setContent] = useState(initialContent);

  return (
    <EditorProvider 
      slotBefore={<MenuBar />} 
      extensions={extensions} 
      content={content}
      
      >
          
          <EditorEvents onEditingEnd={onEditingEnd}/> 
         
      
      </EditorProvider>
  )
}

function EditorEvents({onEditingEnd}: {onEditingEnd: (s: string)=>void}) {
  const {editor} = useContext(EditorContext)

  useEffect(() => {
    if (!editor) return

    const handleBlur = () => {
      console.log('Editor blurred!', editor.getHTML())
      onEditingEnd(editor.getHTML());
    }

    
    editor.on('blur', handleBlur)

    return () => {
      editor.off('blur', handleBlur)
    }
  }, [editor])

  return null
}
