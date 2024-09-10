# terraform-type-parser

A library to convert Terraform types to readable formats.

## Installation

```bash
npm install terraform-type-parser
```

## Usage
```
import { TerraformTypeConverter } from 'terraform-type-parser';

const terraformString = "${list(object({\n open_id_url = string\n open_id_arn = string\n service_name = string\n namespace = string\n }))}";
const result = TerraformTypeConverter.parseTerraformString(terraformString);
console.log(result);
```