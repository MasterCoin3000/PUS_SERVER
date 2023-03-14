const { reject } = require('bcrypt/promises');
const ldap = require('ldapjs');
const User = require('../user/model/user.model');

exports.getUsers = async () => {
    const client = ldap.createClient({
        url: ['ldap://172.31.196.59', 'ldap://172.31.196.59']
      });
      
      return new Promise((resolve,reject) => {
        client.bind('cn=admin,dc=coinwatch,dc=com', 'YBT.J410Cyber-',async (err) => {
      
          const opts = {
              filter: '(&(objectClass=*)(!(cn=Operadores Coinwatch)))',
              scope: 'sub',
              attributes: ['cn', 'userpassword' ]
      
            };
      
          client.search('cn=Operadores Coinwatch,dc=coinwatch,dc=com', opts, async (err, res) => {
            if (err) {
                console.log("oh shit!");
                console.log(err);
                resolve(err)    
            }  

              const usersInDirectoty = [];

              res.on('searchEntry', async (entry) => {

                  //console.log(JSON.stringify(entry.object.userPassword));
                  /*
                    const userName = entry.object.cn;
                    const password = entry.object.userPassword;
      
                    const newUser = await User.create({ userName, password});
                  
                    console.log('new user: ' + newUser);
                */

                    usersInDirectoty.push({userName: entry.object.cn, password: entry.object.userPassword})
               //console.log();
               //console.log();
              });
      
              res.on('error', (err) => {
                console.error('error: ' + err.message);
              });

              res.on("end", (result) => {
                console.log("done ");
                resolve(usersInDirectoty);
              })

          }); 

          });
       
          client.on("connectRefused",(err) => {
            console.log(err);
            reject(err)
          })

      })
      
}

