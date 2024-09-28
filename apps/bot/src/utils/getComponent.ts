import { ClientWithComponents, ComponentType } from '../common';

export const getComponent = (client: ClientWithComponents, type: ComponentType, id: string) => {
  return client[type]?.get(id);
};
