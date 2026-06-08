import UserList from "@/components/UserList";
import { userService } from "@/lib/services/user.service";

export default async function UsersPage() {
  const users = await userService.getAll();

  return (
    <div>
      <h1 className="text-white">Users</h1>
      <UserList users={users} />
    </div>
  );
}
