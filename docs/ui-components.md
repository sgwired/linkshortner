# UI Components Guidelines

## Overview
This project uses **shadcn/ui (base-nova)** exclusively for all UI components. All UI elements must use shadcn/ui components.

## 🚨 Critical Rules

### Component Usage
- ✅ **ALWAYS use shadcn/ui components** for UI elements
- ❌ **NEVER create custom UI components** from scratch
- ✅ Use shadcn/ui CLI to add new components
- ✅ Customize existing shadcn/ui components if needed
- ❌ **DO NOT** build buttons, inputs, modals, etc. manually

## 📦 Adding Components

### Using the CLI
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add card
```

### Common Components
All components are installed to `/components/ui/`:
- **Button** - `button.tsx`
- **Input** - `input.tsx`
- **Dialog/Modal** - `dialog.tsx`
- **Card** - `card.tsx`
- **Form** - `form.tsx`
- **Select** - `select.tsx`
- **Dropdown Menu** - `dropdown-menu.tsx`
- **Toast** - `toast.tsx` + `use-toast.ts`
- **Table** - `table.tsx`

[View all available components](https://ui.shadcn.com/docs/components)

## ✅ Correct Usage

### Import from /components/ui
```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
```

### Use Built-in Variants
```typescript
<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Menu</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Customize with className
```typescript
<Button className="w-full bg-primary">
  Full Width Button
</Button>
```

## 🎨 Customization

### When You Need Custom Styling
- ✅ Use `className` prop with Tailwind utilities
- ✅ Extend variants in the component file using CVA
- ✅ Modify the shadcn/ui component file in `/components/ui/`
- ❌ **DO NOT** create a new component file from scratch

### Example: Extending a Component
```typescript
// Modify /components/ui/button.tsx
const buttonVariants = cva(
  "base classes...",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
        outline: "...",
        // Add your custom variant
        custom: "bg-custom text-custom-foreground hover:bg-custom/90",
      },
    },
  }
);
```

## 🏗️ Composition Patterns

### Composing shadcn/ui Components
```typescript
// ✅ Correct: Compose shadcn/ui components
export function LinkCard({ title, url }: LinkCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{url}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Edit</Button>
      </CardFooter>
    </Card>
  );
}

// ❌ Wrong: Creating custom UI primitives
export function CustomButton({ children }: Props) {
  return <button className="...">{children}</button>;
}
```

## 📋 Implementation Checklist

### Before Creating Any UI Element
- [ ] Check if shadcn/ui has this component
- [ ] Install the component with `npx shadcn@latest add [component]`
- [ ] Import from `@/components/ui/[component]`
- [ ] Use built-in variants first
- [ ] Customize with `className` or CVA if needed

### What NOT to Do
- ❌ Create custom buttons, inputs, or form elements
- ❌ Build modals or dialogs from scratch
- ❌ Use raw HTML elements for UI (`<button>`, `<input>`)
- ❌ Import UI components from other libraries
- ❌ Reinvent components that shadcn/ui provides

## 🎯 Common Components Quick Reference

```typescript
// Forms
<Input type="email" placeholder="Email" />
<Textarea placeholder="Description" />
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>

// Dialogs
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>

// Cards
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
  <CardFooter>{/* Actions */}</CardFooter>
</Card>

// Toasts (notifications)
import { useToast } from "@/components/ui/use-toast";

const { toast } = useToast();
toast({
  title: "Success",
  description: "Link created successfully",
});
```

## 🔗 Resources

- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [shadcn/ui Installation](https://ui.shadcn.com/docs/installation/next)
- [Base UI Primitives](https://base-ui.com/)

---

**Last Updated**: April 19, 2026
