import type React from "react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { type Profile } from "@/actions/profiles/types"
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const DisplayGroups = ({profile}:{ profile: Profile}) => {

    console.log("DisplayGroups displaying", profile);
    
    return <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Groups</Label>
              <p className="text-sm text-muted-foreground">Groups this user belongs to</p>
            </div>

            {profile.groups.length > 0 ? (
              <div className="space-y-3">
                {profile.groups.map((group, index) => (
                  <div key={group.group_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-xs">{group.title}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {group.role}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No groups assigned</p>
            )}
          </div>
}

