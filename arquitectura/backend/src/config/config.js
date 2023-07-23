/* import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program
    .option('--mode <mode>', "Ingrese el modo de trabajo", 'DEVELOPMENT')
program.parse()

const enviroment = program.opts().mode

dotenv.config({
    path: enviroment === "DEVELOPMENT" 
    ? './.env.development' 
    : './.env.production'
})

dotenv.config({ path: envFilePath }); */

// import dotenv from 'dotenv';
// import { Command } from 'commander';

// const program = new Command();

// program
//     .option('--mode <mode>', 'Ingrese el modo de trabajo', 'DEVELOPMENT')
// program.parse();

// const environment = program.opts().mode;

// const envFilePath = environment === 'DEVELOPMENT'
//     ? './.env.development'
//     : './.env.production';

// dotenv.config({ path: envFilePath });


import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();

program
  .option('--mode <mode>', 'Ingrese el modo de trabajo', 'DEVELOPMENT')
program.parse();

const environment = program.opts().mode;

let envFilePath

switch (environment) {
  case 'DEVELOPMENT':
    envFilePath = './.env.development'
    break
  case 'TESTING':
    envFilePath = './.env.testing'
    break
  case 'PRODUCTION':
    envFilePath = './.env.production'
    break
  default:
    envFilePath = './.env.development'
    break
}


dotenv.config({ path: envFilePath });
