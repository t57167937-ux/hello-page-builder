// Component Lab JSON Configuration
// Each component has multiple variants defined as JSON

export interface ComponentVariant {
  id: string;
  title: string;
  description: string;
  props: Record<string, any>;
  code: string;
}

export interface ComponentLabConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  variants: ComponentVariant[];
}

// Button Lab Configuration
export const buttonLabConfig: ComponentLabConfig = {
  id: "button",
  name: "Button",
  description: "Displays a button or a component that looks like a button.",
  category: "Actions",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "The default button style with primary colors",
      props: { variant: "default", children: "Button" },
      code: `<Button>Button</Button>`,
    },
    {
      id: "secondary",
      title: "Secondary",
      description: "Secondary button with muted colors",
      props: { variant: "secondary", children: "Secondary" },
      code: `<Button variant="secondary">Secondary</Button>`,
    },
    {
      id: "destructive",
      title: "Destructive",
      description: "Used for destructive actions like delete",
      props: { variant: "destructive", children: "Delete" },
      code: `<Button variant="destructive">Delete</Button>`,
    },
    {
      id: "outline",
      title: "Outline",
      description: "Button with an outline border",
      props: { variant: "outline", children: "Outline" },
      code: `<Button variant="outline">Outline</Button>`,
    },
    {
      id: "ghost",
      title: "Ghost",
      description: "Minimal button without background",
      props: { variant: "ghost", children: "Ghost" },
      code: `<Button variant="ghost">Ghost</Button>`,
    },
    {
      id: "link",
      title: "Link",
      description: "Button that looks like a link",
      props: { variant: "link", children: "Link Button" },
      code: `<Button variant="link">Link Button</Button>`,
    },
    {
      id: "small",
      title: "Small",
      description: "Smaller button size",
      props: { size: "sm", children: "Small" },
      code: `<Button size="sm">Small</Button>`,
    },
    {
      id: "large",
      title: "Large",
      description: "Larger button size",
      props: { size: "lg", children: "Large Button" },
      code: `<Button size="lg">Large Button</Button>`,
    },
    {
      id: "icon",
      title: "Icon Only",
      description: "Button with only an icon",
      props: { size: "icon", variant: "outline" },
      code: `<Button size="icon" variant="outline"><Settings /></Button>`,
    },
    {
      id: "with-icon-left",
      title: "With Left Icon",
      description: "Button with an icon on the left",
      props: { children: "Email", iconLeft: "Mail" },
      code: `<Button><Mail className="mr-2 h-4 w-4" /> Email</Button>`,
    },
    {
      id: "with-icon-right",
      title: "With Right Icon",
      description: "Button with an icon on the right",
      props: { children: "Next", iconRight: "ArrowRight" },
      code: `<Button>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>`,
    },
    {
      id: "loading",
      title: "Loading",
      description: "Button in loading state",
      props: { disabled: true, loading: true, children: "Loading..." },
      code: `<Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading</Button>`,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Disabled button state",
      props: { disabled: true, children: "Disabled" },
      code: `<Button disabled>Disabled</Button>`,
    },
    {
      id: "full-width",
      title: "Full Width",
      description: "Button that spans full width",
      props: { className: "w-full", children: "Full Width" },
      code: `<Button className="w-full">Full Width</Button>`,
    },
  ],
};

// Card Lab Configuration
export const cardLabConfig: ComponentLabConfig = {
  id: "card",
  name: "Card",
  description: "Displays a card with header, content, and footer.",
  category: "Layout",
  variants: [
    {
      id: "basic",
      title: "Basic Card",
      description: "Simple card with title and content",
      props: { title: "Card Title", description: "Card description text" },
      code: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
</Card>`,
    },
    {
      id: "with-footer",
      title: "With Footer",
      description: "Card with header, content, and footer",
      props: { hasFooter: true },
      code: `<Card>
  <CardHeader>
    <CardTitle>Project Settings</CardTitle>
  </CardHeader>
  <CardContent>Settings content</CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>`,
    },
    {
      id: "interactive",
      title: "Interactive",
      description: "Hoverable card with click action",
      props: { interactive: true },
      code: `<Card className="cursor-pointer hover:shadow-lg transition-shadow">
  <CardContent>Click me</CardContent>
</Card>`,
    },
    {
      id: "pricing",
      title: "Pricing Card",
      description: "Card designed for pricing display",
      props: { type: "pricing", price: "$29", period: "/month" },
      code: `<Card className="border-primary">
  <CardHeader>
    <CardTitle>Pro Plan</CardTitle>
    <div className="text-3xl font-bold">$29<span className="text-sm">/mo</span></div>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2">
      <li>✓ Feature 1</li>
      <li>✓ Feature 2</li>
    </ul>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Subscribe</Button>
  </CardFooter>
</Card>`,
    },
    {
      id: "stat",
      title: "Stat Card",
      description: "Card for displaying statistics",
      props: { type: "stat", value: "2,345", label: "Total Users" },
      code: `<Card>
  <CardContent className="pt-6">
    <div className="text-2xl font-bold">2,345</div>
    <p className="text-muted-foreground">Total Users</p>
  </CardContent>
</Card>`,
    },
    {
      id: "profile",
      title: "Profile Card",
      description: "Card for user profile display",
      props: { type: "profile" },
      code: `<Card>
  <CardContent className="flex items-center gap-4 pt-6">
    <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
    <div>
      <p className="font-semibold">John Doe</p>
      <p className="text-sm text-muted-foreground">john@example.com</p>
    </div>
  </CardContent>
</Card>`,
    },
    {
      id: "notification",
      title: "Notification Card",
      description: "Card for notifications",
      props: { type: "notification", unread: true },
      code: `<Card className="border-l-4 border-l-primary">
  <CardContent className="pt-4">
    <p className="font-medium">New message received</p>
    <p className="text-sm text-muted-foreground">2 minutes ago</p>
  </CardContent>
</Card>`,
    },
    {
      id: "gradient",
      title: "Gradient Card",
      description: "Card with gradient background",
      props: { gradient: true },
      code: `<Card className="bg-gradient-to-br from-primary/20 to-primary/5">
  <CardContent>Gradient background</CardContent>
</Card>`,
    },
  ],
};

// Badge Lab Configuration
export const badgeLabConfig: ComponentLabConfig = {
  id: "badge",
  name: "Badge",
  description: "Displays a badge or a component that looks like a badge.",
  category: "Display",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "Primary badge style",
      props: { variant: "default", children: "Badge" },
      code: `<Badge>Badge</Badge>`,
    },
    {
      id: "secondary",
      title: "Secondary",
      description: "Muted badge style",
      props: { variant: "secondary", children: "Secondary" },
      code: `<Badge variant="secondary">Secondary</Badge>`,
    },
    {
      id: "destructive",
      title: "Destructive",
      description: "Error or warning badge",
      props: { variant: "destructive", children: "Error" },
      code: `<Badge variant="destructive">Error</Badge>`,
    },
    {
      id: "outline",
      title: "Outline",
      description: "Badge with border only",
      props: { variant: "outline", children: "Outline" },
      code: `<Badge variant="outline">Outline</Badge>`,
    },
    {
      id: "with-dot",
      title: "With Status Dot",
      description: "Badge with status indicator",
      props: { hasDot: true, children: "Online" },
      code: `<Badge className="gap-1.5">
  <span className="h-2 w-2 rounded-full bg-green-500" />
  Online
</Badge>`,
    },
    {
      id: "pill",
      title: "Pill Shape",
      description: "Rounded pill-shaped badge",
      props: { className: "rounded-full px-3", children: "Pill" },
      code: `<Badge className="rounded-full px-3">Pill</Badge>`,
    },
    {
      id: "with-icon",
      title: "With Icon",
      description: "Badge with an icon",
      props: { children: "Featured", hasIcon: true },
      code: `<Badge><Star className="mr-1 h-3 w-3" /> Featured</Badge>`,
    },
    {
      id: "counter",
      title: "Counter",
      description: "Badge showing a count",
      props: { children: "99+", isCounter: true },
      code: `<Badge className="h-5 min-w-5 rounded-full">99+</Badge>`,
    },
  ],
};

// Input Lab Configuration
export const inputLabConfig: ComponentLabConfig = {
  id: "input",
  name: "Input",
  description: "Displays a form input field.",
  category: "Forms",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "Standard input field",
      props: { placeholder: "Enter text..." },
      code: `<Input placeholder="Enter text..." />`,
    },
    {
      id: "with-label",
      title: "With Label",
      description: "Input with a label above",
      props: { label: "Email", placeholder: "you@example.com" },
      code: `<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" placeholder="you@example.com" />
</div>`,
    },
    {
      id: "password",
      title: "Password",
      description: "Password input type",
      props: { type: "password", placeholder: "••••••••" },
      code: `<Input type="password" placeholder="••••••••" />`,
    },
    {
      id: "with-icon-left",
      title: "With Left Icon",
      description: "Input with icon prefix",
      props: { iconLeft: "Search", placeholder: "Search..." },
      code: `<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input className="pl-10" placeholder="Search..." />
</div>`,
    },
    {
      id: "with-icon-right",
      title: "With Right Icon",
      description: "Input with icon suffix",
      props: { iconRight: "Check", placeholder: "Validated" },
      code: `<div className="relative">
  <Input placeholder="Validated" />
  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
</div>`,
    },
    {
      id: "with-button",
      title: "With Button",
      description: "Input with attached button",
      props: { hasButton: true, placeholder: "Enter email" },
      code: `<div className="flex gap-2">
  <Input placeholder="Enter email" />
  <Button>Subscribe</Button>
</div>`,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Disabled input state",
      props: { disabled: true, value: "Disabled" },
      code: `<Input disabled value="Disabled" />`,
    },
    {
      id: "error",
      title: "With Error",
      description: "Input with error state",
      props: { error: true, placeholder: "Invalid input" },
      code: `<div className="space-y-1">
  <Input className="border-destructive" placeholder="Invalid input" />
  <p className="text-sm text-destructive">This field is required</p>
</div>`,
    },
    {
      id: "file",
      title: "File Input",
      description: "File upload input",
      props: { type: "file" },
      code: `<Input type="file" />`,
    },
  ],
};

// Alert Lab Configuration
export const alertLabConfig: ComponentLabConfig = {
  id: "alert",
  name: "Alert",
  description: "Displays a callout for user attention.",
  category: "Feedback",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "Standard alert message",
      props: { title: "Heads up!", description: "You can add components to your app." },
      code: `<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components to your app.</AlertDescription>
</Alert>`,
    },
    {
      id: "destructive",
      title: "Destructive",
      description: "Error or warning alert",
      props: { variant: "destructive", title: "Error", description: "Something went wrong." },
      code: `<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>`,
    },
    {
      id: "success",
      title: "Success",
      description: "Success confirmation alert",
      props: { type: "success", title: "Success!", description: "Your changes have been saved." },
      code: `<Alert className="border-green-500 text-green-700">
  <CheckCircle2 className="h-4 w-4" />
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>`,
    },
    {
      id: "info",
      title: "Info",
      description: "Informational alert",
      props: { type: "info", title: "Note", description: "This is additional information." },
      code: `<Alert className="border-blue-500 text-blue-700">
  <Info className="h-4 w-4" />
  <AlertTitle>Note</AlertTitle>
  <AlertDescription>This is additional information.</AlertDescription>
</Alert>`,
    },
    {
      id: "warning",
      title: "Warning",
      description: "Warning alert",
      props: { type: "warning", title: "Warning", description: "Please review before proceeding." },
      code: `<Alert className="border-yellow-500 text-yellow-700">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Please review before proceeding.</AlertDescription>
</Alert>`,
    },
    {
      id: "with-action",
      title: "With Action",
      description: "Alert with action button",
      props: { hasAction: true },
      code: `<Alert>
  <AlertTitle>Update available</AlertTitle>
  <AlertDescription className="flex items-center justify-between">
    <span>A new version is ready to install.</span>
    <Button size="sm">Update</Button>
  </AlertDescription>
</Alert>`,
    },
  ],
};

// Switch Lab Configuration
export const switchLabConfig: ComponentLabConfig = {
  id: "switch",
  name: "Switch",
  description: "A control that toggles between on and off states.",
  category: "Forms",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "Basic toggle switch",
      props: {},
      code: `<Switch />`,
    },
    {
      id: "with-label",
      title: "With Label",
      description: "Switch with label text",
      props: { label: "Airplane Mode" },
      code: `<div className="flex items-center space-x-2">
  <Switch id="airplane" />
  <Label htmlFor="airplane">Airplane Mode</Label>
</div>`,
    },
    {
      id: "with-description",
      title: "With Description",
      description: "Switch with label and description",
      props: { label: "Notifications", description: "Receive push notifications" },
      code: `<div className="flex items-center justify-between">
  <div className="space-y-0.5">
    <Label>Notifications</Label>
    <p className="text-sm text-muted-foreground">Receive push notifications</p>
  </div>
  <Switch />
</div>`,
    },
    {
      id: "checked",
      title: "Checked",
      description: "Switch in on state",
      props: { checked: true },
      code: `<Switch checked />`,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Disabled switch",
      props: { disabled: true },
      code: `<Switch disabled />`,
    },
    {
      id: "disabled-checked",
      title: "Disabled Checked",
      description: "Disabled switch in on state",
      props: { disabled: true, checked: true },
      code: `<Switch disabled checked />`,
    },
  ],
};

// Checkbox Lab Configuration
export const checkboxLabConfig: ComponentLabConfig = {
  id: "checkbox",
  name: "Checkbox",
  description: "A control for toggling between checked and unchecked.",
  category: "Forms",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "Basic checkbox",
      props: {},
      code: `<Checkbox />`,
    },
    {
      id: "with-label",
      title: "With Label",
      description: "Checkbox with label",
      props: { label: "Accept terms" },
      code: `<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`,
    },
    {
      id: "checked",
      title: "Checked",
      description: "Checked checkbox",
      props: { checked: true },
      code: `<Checkbox checked />`,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Disabled checkbox",
      props: { disabled: true },
      code: `<Checkbox disabled />`,
    },
    {
      id: "indeterminate",
      title: "Indeterminate",
      description: "Partially selected state",
      props: { indeterminate: true },
      code: `<Checkbox checked="indeterminate" />`,
    },
    {
      id: "group",
      title: "Checkbox Group",
      description: "Multiple checkboxes",
      props: { isGroup: true, options: ["Option 1", "Option 2", "Option 3"] },
      code: `<div className="space-y-2">
  <div className="flex items-center space-x-2">
    <Checkbox id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <Checkbox id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </div>
</div>`,
    },
  ],
};

// Select Lab Configuration
export const selectLabConfig: ComponentLabConfig = {
  id: "select",
  name: "Select",
  description: "Displays a list of options for the user to pick from.",
  category: "Forms",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "Basic select dropdown",
      props: { placeholder: "Select option", options: ["Option 1", "Option 2", "Option 3"] },
      code: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>`,
    },
    {
      id: "with-label",
      title: "With Label",
      description: "Select with label",
      props: { label: "Country" },
      code: `<div className="space-y-2">
  <Label>Country</Label>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
    </SelectContent>
  </Select>
</div>`,
    },
    {
      id: "with-groups",
      title: "With Groups",
      description: "Grouped options",
      props: { hasGroups: true },
      code: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Vegetables</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Disabled select",
      props: { disabled: true },
      code: `<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="Disabled" />
  </SelectTrigger>
</Select>`,
    },
  ],
};

// Tabs Lab Configuration
export const tabsLabConfig: ComponentLabConfig = {
  id: "tabs",
  name: "Tabs",
  description: "A set of layered sections of content.",
  category: "Navigation",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "Basic tabs component",
      props: { tabs: ["Tab 1", "Tab 2", "Tab 3"] },
      code: `<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>`,
    },
    {
      id: "full-width",
      title: "Full Width",
      description: "Tabs spanning full width",
      props: { fullWidth: true },
      code: `<Tabs defaultValue="tab1" className="w-full">
  <TabsList className="w-full">
    <TabsTrigger value="tab1" className="flex-1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2" className="flex-1">Tab 2</TabsTrigger>
  </TabsList>
</Tabs>`,
    },
    {
      id: "with-icons",
      title: "With Icons",
      description: "Tabs with icons",
      props: { hasIcons: true },
      code: `<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">
      <User className="mr-2 h-4 w-4" /> Account
    </TabsTrigger>
    <TabsTrigger value="settings">
      <Settings className="mr-2 h-4 w-4" /> Settings
    </TabsTrigger>
  </TabsList>
</Tabs>`,
    },
    {
      id: "vertical",
      title: "Vertical",
      description: "Vertically stacked tabs",
      props: { orientation: "vertical" },
      code: `<Tabs defaultValue="tab1" orientation="vertical">
  <TabsList className="flex-col h-auto">
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
</Tabs>`,
    },
    {
      id: "underlined",
      title: "Underlined",
      description: "Underline style tabs",
      props: { variant: "underlined" },
      code: `<Tabs defaultValue="tab1">
  <TabsList className="bg-transparent border-b rounded-none">
    <TabsTrigger value="tab1" className="data-[state=active]:border-b-2 border-primary rounded-none">Tab 1</TabsTrigger>
  </TabsList>
</Tabs>`,
    },
  ],
};

// Progress Lab Configuration
export const progressLabConfig: ComponentLabConfig = {
  id: "progress",
  name: "Progress",
  description: "Displays an indicator showing completion progress.",
  category: "Feedback",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "Basic progress bar",
      props: { value: 60 },
      code: `<Progress value={60} />`,
    },
    {
      id: "zero",
      title: "Zero",
      description: "Empty progress bar",
      props: { value: 0 },
      code: `<Progress value={0} />`,
    },
    {
      id: "complete",
      title: "Complete",
      description: "Full progress bar",
      props: { value: 100 },
      code: `<Progress value={100} />`,
    },
    {
      id: "with-label",
      title: "With Label",
      description: "Progress with percentage label",
      props: { value: 75, showLabel: true },
      code: `<div className="space-y-1">
  <div className="flex justify-between text-sm">
    <span>Progress</span>
    <span>75%</span>
  </div>
  <Progress value={75} />
</div>`,
    },
    {
      id: "indeterminate",
      title: "Indeterminate",
      description: "Loading state without known progress",
      props: { indeterminate: true },
      code: `<Progress className="animate-pulse" />`,
    },
    {
      id: "colored",
      title: "Colored",
      description: "Progress with custom color",
      props: { value: 50, color: "green" },
      code: `<Progress value={50} className="[&>div]:bg-green-500" />`,
    },
  ],
};

// Slider Lab Configuration
export const sliderLabConfig: ComponentLabConfig = {
  id: "slider",
  name: "Slider",
  description: "An input where the user selects a value from within a given range.",
  category: "Forms",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "Basic slider",
      props: { defaultValue: [50] },
      code: `<Slider defaultValue={[50]} max={100} step={1} />`,
    },
    {
      id: "with-label",
      title: "With Label",
      description: "Slider with label and value",
      props: { defaultValue: [75], showValue: true },
      code: `<div className="space-y-2">
  <div className="flex justify-between">
    <Label>Volume</Label>
    <span className="text-sm text-muted-foreground">75%</span>
  </div>
  <Slider defaultValue={[75]} max={100} />
</div>`,
    },
    {
      id: "range",
      title: "Range",
      description: "Dual-thumb range slider",
      props: { defaultValue: [25, 75], isRange: true },
      code: `<Slider defaultValue={[25, 75]} max={100} step={1} />`,
    },
    {
      id: "stepped",
      title: "Stepped",
      description: "Slider with discrete steps",
      props: { defaultValue: [50], step: 10 },
      code: `<Slider defaultValue={[50]} max={100} step={10} />`,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Disabled slider",
      props: { defaultValue: [50], disabled: true },
      code: `<Slider defaultValue={[50]} disabled />`,
    },
  ],
};

// Radio Group Lab Configuration
export const radioLabConfig: ComponentLabConfig = {
  id: "radio",
  name: "Radio Group",
  description: "A set of checkable buttons where only one can be checked at a time.",
  category: "Forms",
  variants: [
    {
      id: "default",
      title: "Default",
      description: "Basic radio group",
      props: { options: ["Option 1", "Option 2", "Option 3"] },
      code: `<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </div>
</RadioGroup>`,
    },
    {
      id: "horizontal",
      title: "Horizontal",
      description: "Horizontally aligned radio group",
      props: { orientation: "horizontal" },
      code: `<RadioGroup defaultValue="option1" className="flex gap-4">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="h1" />
    <Label htmlFor="h1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="h2" />
    <Label htmlFor="h2">Option 2</Label>
  </div>
</RadioGroup>`,
    },
    {
      id: "with-description",
      title: "With Description",
      description: "Radio options with descriptions",
      props: { hasDescriptions: true },
      code: `<RadioGroup>
  <div className="flex items-start space-x-3 p-3 border rounded-lg">
    <RadioGroupItem value="plan1" id="plan1" className="mt-1" />
    <div>
      <Label htmlFor="plan1">Basic Plan</Label>
      <p className="text-sm text-muted-foreground">Best for individuals</p>
    </div>
  </div>
</RadioGroup>`,
    },
    {
      id: "card-style",
      title: "Card Style",
      description: "Radio as card selection",
      props: { variant: "card" },
      code: `<RadioGroup className="grid grid-cols-2 gap-4">
  <Label className="border rounded-lg p-4 cursor-pointer [&:has(:checked)]:border-primary">
    <RadioGroupItem value="card1" className="sr-only" />
    <span>Card Option 1</span>
  </Label>
</RadioGroup>`,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Disabled radio group",
      props: { disabled: true },
      code: `<RadioGroup disabled>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="d1" disabled />
    <Label htmlFor="d1" className="text-muted-foreground">Disabled</Label>
  </div>
</RadioGroup>`,
    },
  ],
};

// Export all lab configs
export const allLabConfigs: ComponentLabConfig[] = [
  buttonLabConfig,
  cardLabConfig,
  badgeLabConfig,
  inputLabConfig,
  alertLabConfig,
  switchLabConfig,
  checkboxLabConfig,
  selectLabConfig,
  tabsLabConfig,
  progressLabConfig,
  sliderLabConfig,
  radioLabConfig,
];

// Get config by component ID
export const getLabConfig = (componentId: string): ComponentLabConfig | undefined => {
  return allLabConfigs.find(config => config.id === componentId);
};
