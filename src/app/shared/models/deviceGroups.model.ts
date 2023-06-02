export class DeviceGroups {
  createdOn: number;
  id: string;
  deviceCount: number;
  name: string;
  checked?: boolean;
}

export class DeviceGroupsResponse {
  content: DeviceGroups[];
  totalElements: number;
  number: number;
  size: number;
  numberOfElements: number;
}
