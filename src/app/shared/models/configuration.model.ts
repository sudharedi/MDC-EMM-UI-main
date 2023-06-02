export class Configurations {
  advanceParam: boolean;
  boolValue: boolean;
  description: string;
  intValue: number;
  maximum: number;
  minimum: number;
  name: string;
  strValue: string;
  type: string;
  unit: string;
  disabled?: boolean;
}

export class ConfigurationsResponse {
  configs: Configurations[];
  lastModifiedBy: string;
  lastModifiedDate: string;
  serial?: string;
}
