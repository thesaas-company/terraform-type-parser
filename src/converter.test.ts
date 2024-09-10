import { TerraformTypeConverter } from './converter';

describe('TerraformTypeConverter', () => {
  test('converts list(object(...)) correctly', () => {
    const terraformString = "${list(object({\n open_id_url = string\n open_id_arn = string\n service_name = string\n namespace = string\n }))}";
    const result = TerraformTypeConverter.parseTerraformString(terraformString);
    expect(result).toEqual([{
      open_id_url: 'String',
      open_id_arn: 'String',
      service_name: 'String',
      namespace: 'String'
    }]);
  });

  test('converts list(string) correctly', () => {
    const terraformString = "${list(string)}";
    const result = TerraformTypeConverter.parseTerraformString(terraformString);
    expect(result).toEqual([{}]);
  });
});
