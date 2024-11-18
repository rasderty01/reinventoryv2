import CreateClerkOrganization from "./createorganization";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

export function CreateOrganizationDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Organization</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader></DialogHeader>
        <CreateClerkOrganization />
      </DialogContent>
    </Dialog>
  );
}
