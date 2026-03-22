import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CodePreview from "../CodePreview";
import { Sparkles } from "lucide-react";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Sparkles size={18} className="text-primary" />
      {children}
    </h2>
  );
}

export default function SwitchPreview() {
  const [enabled, setEnabled] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const basicCode = `import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Switch</SectionTitle>

      <CodePreview title="Basic Switch" code={basicCode}>
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
      </CodePreview>

      <CodePreview title="Switch with State" code={`// Controlled switch component`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="enabled" className="text-base">Enable feature</Label>
              <p className="text-sm text-muted-foreground">
                Turn on this feature to unlock additional options.
              </p>
            </div>
            <Switch 
              id="enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-base">Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about updates.
              </p>
            </div>
            <Switch 
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle dark mode appearance.
              </p>
            </div>
            <Switch 
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>
      </CodePreview>

      <CodePreview title="Disabled Switch" code={`<Switch disabled />`}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="disabled-off" disabled />
            <Label htmlFor="disabled-off" className="text-muted-foreground">Disabled (Off)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="disabled-on" disabled checked />
            <Label htmlFor="disabled-on" className="text-muted-foreground">Disabled (On)</Label>
          </div>
        </div>
      </CodePreview>

      <CodePreview title="Switch Sizes" code={`// Custom sized switches using className`}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="small" className="scale-75" />
            <Label htmlFor="small">Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="default" />
            <Label htmlFor="default">Default</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="large" className="scale-125" />
            <Label htmlFor="large">Large</Label>
          </div>
        </div>
      </CodePreview>
    </div>
  );
}
