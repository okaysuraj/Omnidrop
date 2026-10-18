import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type MaterialName = ComponentProps<typeof MaterialIcons>['name'];
type IoniconName = ComponentProps<typeof Ionicons>['name'];
export type IconName = MaterialName | IoniconName;
type IconProps = Omit<ComponentProps<typeof MaterialIcons>, 'name'> & { name: IconName };

// Keep icon-family selection in one place for buttons and inputs.
export function BrutalIcon({ name, ...props }: IconProps) {
  if (name in MaterialIcons.glyphMap)
    return <MaterialIcons name={name as MaterialName} {...props} />;
  return <Ionicons name={name as IoniconName} {...props} />;
}
