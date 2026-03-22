import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import CodePreview from "../CodePreview";
import { Sparkles, Trash2, LogOut, AlertTriangle, Shield, CreditCard } from "lucide-react";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Sparkles size={18} className="text-primary" />
      {children}
    </h2>
  );
}

export default function AlertDialogPreview() {
  const [isOpen, setIsOpen] = useState(false);

  const basicCode = `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Show Dialog</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your
        account and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`;

  const deleteCode = `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Account
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        Delete Account
      </AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete your account, all your projects,
        and remove all associated data. This action is irreversible.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep Account</AlertDialogCancel>
      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
        Yes, Delete Everything
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`;

  return (
    <div className="space-y-6">
      <SectionTitle>Alert Dialogs</SectionTitle>

      <CodePreview title="Basic Alert Dialog" code={basicCode}>
        <div className="flex flex-wrap gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CodePreview>

      <CodePreview title="Destructive Action" code={deleteCode}>
        <div className="flex flex-wrap gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Delete Account
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account, all your projects,
                  and remove all associated data. This action is irreversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Account</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CodePreview>

      <CodePreview title="Logout Confirmation" code={`// Logout confirmation dialog`}>
        <div className="flex flex-wrap gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  You'll need to sign in again to access your dashboard and projects.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Stay signed in</AlertDialogCancel>
                <AlertDialogAction>Sign out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CodePreview>

      <CodePreview title="Security Verification" code={`// Security verification dialog`}>
        <div className="flex flex-wrap gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">
                <Shield className="mr-2 h-4 w-4" />
                Change Security Settings
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Verify Your Identity
                </AlertDialogTitle>
                <AlertDialogDescription>
                  For your security, we need to verify your identity before making
                  changes to your security settings. A verification code will be
                  sent to your email.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Send Verification</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CodePreview>

      <CodePreview title="Payment Confirmation" code={`// Payment confirmation dialog`}>
        <div className="flex flex-wrap gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Your Upgrade</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>You're about to upgrade to the Pro plan:</p>
                  <div className="rounded-lg bg-muted p-3 mt-2">
                    <p className="font-medium text-foreground">Pro Plan - $29/month</p>
                    <p className="text-sm">Billed monthly, cancel anytime</p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Confirm & Pay</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CodePreview>
    </div>
  );
}
