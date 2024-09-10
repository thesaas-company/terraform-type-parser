export class TerraformTypeConverter {
    private static typeMappings: Record<string, string> = {
      string: 'String',
      number: 'Number',
      bool: 'Bool',
      'list(': 'Array',
      'set(': 'Array',
      'tuple(': 'Array',
      'map(': 'Object',
      'object(': 'Object',
      null: 'null'
    };
  
    private static extractInnerType(terraformType: string): string {
      const match = terraformType.match(/\((.*)\)/);
      if (match) {
        return match[1].trim();
      }
      return 'Unknown Type';
    }
  
    public static convertTerraformType(terraformType: string): string | any[] {
      terraformType = terraformType.trim();
  
      for (const [key, value] of Object.entries(TerraformTypeConverter.typeMappings)) {
        if (terraformType.startsWith(key)) {
          const innerType = TerraformTypeConverter.extractInnerType(terraformType);
  
          if (value === 'Array') {
            const innerReadableType = TerraformTypeConverter.convertTerraformType(innerType);
            if (innerReadableType === 'Object') {
              return [{}];
            } else {
              return [innerReadableType];
            }
          }
  
          return value;
        }
      }
  
      if (TerraformTypeConverter.typeMappings[terraformType]) {
        return TerraformTypeConverter.typeMappings[terraformType];
      }
  
      return 'Unknown Type';
    }
  
    public static parseTerraformString(terraformString: string): any {
      if (terraformString.startsWith('${list')) {
        const innerContent = terraformString.match(/\${list\((.*)\)\}/s)?.[1]?.trim();
        if (innerContent) {
          const parsedObject = this.parseTerraformString(`\${${innerContent}}`);
          return Array.isArray(parsedObject) ? parsedObject : [parsedObject];
        }
      }
  
      const cleanString = terraformString
        .replace(/\${|list|set|object|\(|\)|}/g, '')
        .trim();
  
      const lines = cleanString.split('\n').map(line => line.trim()).filter(Boolean);
  
      const result: Record<string, any> = {};
  
      lines.forEach(line => {
        const [key, terraformType] = line.split('=').map(part => part.trim());
        if (key && terraformType) {
          const convertedType = TerraformTypeConverter.convertTerraformType(terraformType);
          result[key] = convertedType;
        }
      });
  
      return result;
    }
  }
  