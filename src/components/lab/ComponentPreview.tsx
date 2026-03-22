import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, CreditCard, Settings, User, AlertCircle, CheckCircle2, Info, Mail, Lock, Sparkles,
  ChevronDown, MoreHorizontal, LogOut, UserPlus, Cloud, Github, LifeBuoy, Check, ChevronsUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import CodePreview from "./CodePreview";

interface ComponentPreviewProps {
  componentId: string;
}

export default function ComponentPreview({ componentId }: ComponentPreviewProps) {
  return (
    <ScrollArea className="h-full custom-scrollbar">
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <PreviewContent componentId={componentId} />
      </div>
    </ScrollArea>
  );
}

// Import new preview components
import TooltipPreviewNew from "./previews/TooltipPreview";
import ProgressPreviewNew from "./previews/ProgressPreview";
import CommandPreviewNew from "./previews/CommandPreview";
import PopoverPreviewNew from "./previews/PopoverPreview";
import ComboboxPreviewNew from "./previews/ComboboxPreview";
import DialogPreviewNew from "./previews/DialogPreview";
import DropdownPreviewNew from "./previews/DropdownPreview";
import CheckboxPreviewNew from "./previews/CheckboxPreview";
import CardPreviewNew from "./previews/CardPreview";
import AlertDialogPreviewNew from "./previews/AlertDialogPreview";
import BreadcrumbPreviewNew from "./previews/BreadcrumbPreview";
import CarouselPreviewNew from "./previews/CarouselPreview";
import CompositeInputPreviewNew from "./previews/CompositeInputPreview";
import CollapsiblePreviewNew from "./previews/CollapsiblePreview";
import MenubarPreviewNew from "./previews/MenubarPreview";
import NavigationMenuPreviewNew from "./previews/NavigationMenuPreview";
import ScrollAreaPreviewNew from "./previews/ScrollAreaPreview";
import TogglePreviewNew from "./previews/TogglePreview";
import SeparatorPreviewNew from "./previews/SeparatorPreview";
import SheetPreviewNew from "./previews/SheetPreview";
import SwitchPreviewNew from "./previews/SwitchPreview";

function PreviewContent({ componentId }: { componentId: string }) {
  switch (componentId) {
    case "button":
      return <ButtonPreview />;
    case "input":
      return <InputPreview />;
    case "card":
      return <CardPreviewNew />;
    case "tabs":
      return <TabsPreview />;
    case "accordion":
      return <AccordionPreview />;
    case "badge":
      return <BadgePreview />;
    case "alert":
      return <AlertPreview />;
    case "dialog":
      return <DialogPreviewNew />;
    case "select":
      return <SelectPreview />;
    case "switch":
      return <SwitchPreview />;
    case "slider":
      return <SliderPreview />;
    case "switch":
      return <SwitchPreviewNew />;
    case "checkbox":
      return <CheckboxPreviewNew />;
    case "form":
      return <FormPreview />;
    case "radio":
      return <RadioPreview />;
    case "dropdown":
      return <DropdownPreviewNew />;
    case "tooltip":
      return <TooltipPreviewNew />;
    case "progress":
      return <ProgressPreviewNew />;
    case "command":
      return <CommandPreviewNew />;
    case "popover":
      return <PopoverPreviewNew />;
    case "combobox":
      return <ComboboxPreviewNew />;
    case "alert-dialog":
      return <AlertDialogPreviewNew />;
    case "breadcrumb":
      return <BreadcrumbPreviewNew />;
    case "carousel":
      return <CarouselPreviewNew />;
    case "composite-input":
      return <CompositeInputPreviewNew />;
    case "collapsible":
      return <CollapsiblePreviewNew />;
    case "menubar":
      return <MenubarPreviewNew />;
    case "navigation-menu":
      return <NavigationMenuPreviewNew />;
    case "scroll-area":
      return <ScrollAreaPreviewNew />;
    case "toggle":
      return <TogglePreviewNew />;
    case "separator":
      return <SeparatorPreviewNew />;
    case "sheet":
      return <SheetPreviewNew />;
    default:
      return <AllComponentsPreview />;
  }
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Sparkles size={18} className="text-primary" />
      {children}
    </h2>
  );
}

function ButtonPreview() {
  const { t } = useTranslation();
  
  const buttonCode = `import { Button } from "@/components/ui/button";
import { Mail, Settings } from "lucide-react";

// Variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// With Icons
<Button>
  <Mail className="mr-2 h-4 w-4" />
  Login with Email
</Button>

// States
<Button disabled>Disabled</Button>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Buttons</SectionTitle>
      
      <CodePreview title={t("preview.variants")} code={buttonCode}>
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </CodePreview>

      <CodePreview title={t("preview.sizes")} code={`<Button size="sm">Small</Button>\n<Button size="default">Default</Button>\n<Button size="lg">Large</Button>`}>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </CodePreview>

      <CodePreview title={t("preview.withIcons")} code={`<Button>\n  <Mail className="mr-2 h-4 w-4" />\n  Login with Email\n</Button>`}>
        <div className="flex flex-wrap gap-3">
          <Button><Mail className="mr-2 h-4 w-4" /> Login with Email</Button>
          <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Settings</Button>
        </div>
      </CodePreview>

      <CodePreview title={t("preview.states")} code={`<Button disabled>Disabled</Button>`}>
        <div className="flex flex-wrap gap-3">
          <Button disabled>{t("preview.disabled")}</Button>
          <Button className="animate-pulse">{t("preview.loading")}</Button>
        </div>
      </CodePreview>
    </div>
  );
}

function InputPreview() {
  const inputCode = `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>

<div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <Input id="password" type="password" placeholder="••••••••" />
</div>

<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" placeholder="Type your message here..." />
</div>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Inputs</SectionTitle>
      
      <CodePreview title="Input Fields" code={inputCode}>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled</Label>
            <Input id="disabled" disabled placeholder="Disabled input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="textarea">Message</Label>
            <Textarea id="textarea" placeholder="Type your message here..." />
          </div>
        </div>
      </CodePreview>
    </div>
  );
}

function CardPreview() {
  const cardCode = `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Create project</CardTitle>
    <CardDescription>Deploy your new project in one-click.</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Name of your project" />
      </div>
    </div>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Deploy</Button>
  </CardFooter>
</Card>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Cards</SectionTitle>
      
      <CodePreview title="Card Components" code={cardCode}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name of your project" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="framework">Framework</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="vite">Vite</SelectItem>
                      <SelectItem value="remix">Remix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Premium Plan</CardTitle>
              </div>
              <CardDescription>Unlock all features and get priority support.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$29<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Unlimited projects</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Priority support</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Advanced analytics</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Subscribe</Button>
            </CardFooter>
          </Card>
        </div>
      </CodePreview>
    </div>
  );
}

function TabsPreview() {
  const tabsCode = `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="account" className="w-full">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Make changes to your account here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input id="name" defaultValue="John Doe" />
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Tabs</SectionTitle>
      
      <CodePreview title="Tabs Component" code={tabsCode}>
        <Tabs defaultValue="account" className="w-full max-w-lg">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account"><User className="mr-2 h-4 w-4" />Account</TabsTrigger>
            <TabsTrigger value="password"><Lock className="mr-2 h-4 w-4" />Password</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Make changes to your account here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@johndoe" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email notifications</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CodePreview>
    </div>
  );
}

function AccordionPreview() {
  const accordionCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it styled?</AccordionTrigger>
    <AccordionContent>
      Yes. It comes with default styles that matches the other components.
    </AccordionContent>
  </AccordionItem>
</Accordion>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Accordion</SectionTitle>
      
      <CodePreview title="Accordion Component" code={accordionCode}>
        <Accordion type="single" collapsible className="w-full max-w-lg">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It&apos;s animated by default, but you can disable it if you prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CodePreview>
    </div>
  );
}

function BadgePreview() {
  const badgeCode = `import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Badges</SectionTitle>
      
      <CodePreview title="Badge Variants" code={badgeCode}>
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </CodePreview>
    </div>
  );
}

function AlertPreview() {
  const alertCode = `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle } from "lucide-react";

<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Alerts</SectionTitle>
      
      <CodePreview title="Alert Variants" code={alertCode}>
        <div className="space-y-4 max-w-lg">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components to your app using the cli.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
          </Alert>
        </div>
      </CodePreview>
    </div>
  );
}

function DialogPreview() {
  const dialogCode = `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Dialogs</SectionTitle>
      
      <CodePreview title="Alert Dialog" code={dialogCode}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CodePreview>
    </div>
  );
}

function SelectPreview() {
  const selectCode = `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Select</SectionTitle>
      
      <CodePreview title="Select Component" code={selectCode}>
        <div className="max-w-xs space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CodePreview>
    </div>
  );
}

function SwitchPreview() {
  const switchCode = `import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Switch</SectionTitle>
      
      <CodePreview title="Switch Component" code={switchCode}>
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center justify-between">
            <Label htmlFor="airplane">Airplane Mode</Label>
            <Switch id="airplane" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notifications</Label>
            <Switch id="notifications" defaultChecked />
          </div>
        </div>
      </CodePreview>
    </div>
  );
}

function SliderPreview() {
  const sliderCode = `import { Slider } from "@/components/ui/slider";

<Slider defaultValue={[50]} max={100} step={1} />

// Range slider
<Slider defaultValue={[25, 75]} max={100} step={1} />`;

  return (
    <div className="space-y-6">
      <SectionTitle>Slider</SectionTitle>
      
      <CodePreview title="Slider Component" code={sliderCode}>
        <div className="space-y-6 max-w-sm">
          <div className="space-y-2">
            <Label>Volume</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label>Price Range</Label>
            <Slider defaultValue={[25, 75]} max={100} step={1} />
          </div>
        </div>
      </CodePreview>
    </div>
  );
}

function CheckboxPreview() {
  const checkboxCode = `import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Checkbox</SectionTitle>
      
      <CodePreview title="Checkbox Component" code={checkboxCode}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" defaultChecked />
            <Label htmlFor="marketing">Receive marketing emails</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled" disabled />
            <Label htmlFor="disabled" className="text-muted-foreground">Disabled option</Label>
          </div>
        </div>
      </CodePreview>
    </div>
  );
}

function FormPreview() {
  const formCode = `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

<Card className="max-w-md">
  <CardHeader>
    <CardTitle>Sign In</CardTitle>
    <CardDescription>Enter your credentials to access your account.</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" placeholder="••••••••" />
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id="remember" />
      <Label htmlFor="remember">Remember me</Label>
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Sign In</Button>
  </CardFooter>
</Card>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Form Example</SectionTitle>
      
      <CodePreview title="Sign In Form" code={formCode}>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input id="signin-email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input id="signin-password" type="password" placeholder="••••••••" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Sign In</Button>
          </CardFooter>
        </Card>
      </CodePreview>
    </div>
  );
}

function RadioPreview() {
  const radioCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Radio Group</SectionTitle>
      
      <CodePreview title="Radio Group Component" code={radioCode}>
        <div className="space-y-4 max-w-sm">
          <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup>
        </div>
      </CodePreview>
    </div>
  );
}

function DropdownPreview() {
  const dropdownCode = `import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Dropdown Menu</SectionTitle>
      
      <CodePreview title="Dropdown Menu Component" code={dropdownCode}>
        <div className="flex flex-wrap gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Open Menu <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-popover">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CodePreview>
    </div>
  );
}

function TooltipPreview() {
  const tooltipCode = `import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>This is a tooltip</p>
  </TooltipContent>
</Tooltip>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Tooltip</SectionTitle>
      
      <CodePreview title="Tooltip Component" code={tooltipCode}>
        <div className="flex flex-wrap gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Send us an email</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CodePreview>
    </div>
  );
}

function ProgressPreview() {
  const [progress, setProgress] = useState(33);
  
  const progressCode = `import { Progress } from "@/components/ui/progress";

<Progress value={33} />
<Progress value={66} />
<Progress value={100} />`;

  return (
    <div className="space-y-6">
      <SectionTitle>Progress</SectionTitle>
      
      <CodePreview title="Progress Component" code={progressCode}>
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Loading...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
          
          <div className="space-y-2">
            <Label>Progress States</Label>
            <Progress value={25} className="h-2" />
            <Progress value={50} className="h-3" />
            <Progress value={75} className="h-4" />
            <Progress value={100} className="h-5" />
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setProgress(Math.max(0, progress - 10))}>
              - 10%
            </Button>
            <Button size="sm" variant="outline" onClick={() => setProgress(Math.min(100, progress + 10))}>
              + 10%
            </Button>
          </div>
        </div>
      </CodePreview>
    </div>
  );
}

function ComboboxPreview() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const frameworks = [
    { value: "next", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  const comboboxCode = `import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const [open, setOpen] = useState(false);
const [value, setValue] = useState("");

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline" role="combobox" aria-expanded={open}>
      {value ? frameworks.find((f) => f.value === value)?.label : "Select framework..."}
      <ChevronsUpDown className="ml-2 h-4 w-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[200px] p-0">
    <Command>
      <CommandInput placeholder="Search framework..." />
      <CommandList>
        <CommandEmpty>No framework found.</CommandEmpty>
        <CommandGroup>
          {frameworks.map((framework) => (
            <CommandItem key={framework.value} value={framework.value} onSelect={(v) => { setValue(v); setOpen(false); }}>
              <Check className={cn("mr-2 h-4 w-4", value === framework.value ? "opacity-100" : "opacity-0")} />
              {framework.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Combobox</SectionTitle>
      
      <CodePreview title="Combobox (Command + Popover)" code={comboboxCode}>
        <div className="flex flex-wrap gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? frameworks.find((framework) => framework.value === value)?.label
                  : "Select framework..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-popover">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === framework.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CodePreview>
    </div>
  );
}

function AllComponentsPreview() {
  return (
    <div className="space-y-12">
      <ButtonPreview />
      <InputPreview />
      <CardPreview />
      <BadgePreview />
      <AlertPreview />
      <AccordionPreview />
      <TabsPreview />
      <DialogPreview />
      <SelectPreview />
      <SwitchPreview />
      <SliderPreview />
      <CheckboxPreview />
      <RadioPreview />
      <DropdownPreview />
      <TooltipPreview />
      <ProgressPreview />
      <ComboboxPreview />
      <FormPreview />
    </div>
  );
}
