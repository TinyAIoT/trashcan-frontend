import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, Card, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Component() {
  return (
    <div>
      <div className="px-4 space-y-6 sm:px-6">
        <header className="space-y-2">
          <div className="flex items-center space-x-3">
            <img
              alt="Avatar"
              className="rounded-full"
              height="96"
              src="/stadtlogo-muenster.png"
              style={{
                aspectRatio: "96/96",
                objectFit: "cover",
              }}
              width="96"
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Münster</h1>
              <Button size="sm">Change photo</Button>
            </div>
          </div>
        </header>
        <div className="space-y-8">
          <Card>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input defaultValue="Münster" id="name" placeholder="Münster" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="E.g. jane@example.com" />
              </div>
              <div className="space-y-2">
                <Label>What best in your city?</Label>
                <Textarea
                  className="mt-1"
                  id="bio"
                  placeholder="Some fun fact"
                  style={{
                    minHeight: "100px",
                  }}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div>Language</div>
              <div>Choose your preferred language</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <RadioGroup defaultValue="option-one">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Deutsch</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">English</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div>Change Password</div>
              <div>
                For your security, please do not share your password with
                others.
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="pt-6">
          <Button>Save</Button>
        </div>
      </div>
    </div>
  );
}
