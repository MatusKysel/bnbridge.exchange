#!/bin/bash

if [[ -z $DBUSER ]]; then
  echo "Export DBUSER to environment variable"
  exit
fi

if [[ -z $DBPASSWORD ]]; then
  echo "Export DBPASSWORD to environment variable"
  exit
fi

if [[ -z $DBNAME ]]; then
  echo "Export DBNAME to environment variable"
  exit
fi

if [[ -z $KEY ]]; then
  echo "Export KEY to environment variable"
  exit
fi

if [[ -z $PRIVATE_KEY ]]; then
  echo "Export PRIVATE_KEY to environment variable"
  exit
fi

if [[ -z $CLIPASSWORD ]]; then
  echo "Export CLIPASSWORD to environment variable"
  exit
fi

set +o history


sudo adduser $DBUSER
sudo -u postgres createuser --superuser $DBUSER
sudo -u postgres psql -c "ALTER USER $DBUSER WITH PASSWORD '$DBPASSWORD';"
sudo -u $DBUSER dropdb $DBNAME
sudo -u $DBUSER createdb -O $DBUSER $DBNAME
# Creating tables from setup.sql
sudo -u $DBUSER psql "postgresql://$DBUSER:$DBPASSWORD@localhost/$DBNAME" -f ${PWD}/setup.sql


# Gen encryption keys and encrypted password
var=$(ISTESTNET=1 PRIVATE_KEY=$PRIVATE_KEY KEY=$KEY CLIPASSWORD=$CLIPASSWORD node keygen.js)
pubKey=$(echo $var | cut -d, -f1)
address=$(echo $var | cut -d, -f2)
encr_seed=$(echo $var | cut -d, -f3)
encr_clipassword=$(echo $var | cut -d, -f4)
encr_key=$(echo $var | cut -d, -f5)
# echo "encr_seed = $encr_seed"
# echo "encr_clipassword = $encr_clipassword"
# echo "encr_key = $encr_key"
echo "pubKey = $pubKey"
echo "address = $address"


# Polulate bnb_accounts and tokens table
sudo -u $DBUSER psql "postgresql://$DBUSER:$DBPASSWORD@localhost/$DBNAME" -c "
  INSERT INTO bnb_accounts VALUES (
    '5a89c14e-5385-4e4e-93c0-270c54ffd49e',
    '$pubKey',
    '$encr_seed',
    '$address',
    'bnbcli-keyname-optional',
    '$encr_clipassword',
    '$encr_key',
    now()
  );
"

sudo -u $DBUSER psql "postgresql://$DBUSER:$DBPASSWORD@localhost/$DBNAME" -c "
  INSERT INTO tokens VALUES (
    'd63380b5-4873-46a4-b74e-3afa72d41cc5',
    'TLIT NETWORK BEP2 Testnet',
    'TLIT',
    'LIT-D26',
    145034756,
    '0x65fc0f7d2bb96a9be30a770fb5fcd5a7762ad659',
    true,
    1000,
    0,
    'eth-uuid-optional-testnet',
    '5a89c14e-5385-4e4e-93c0-270c54ffd49e',
    true,
    true,
    'listing-proposal-uuid-testnet',
    true,
    now()
  );
"


set -o history

# You should keep your own copy of the following secrets. unset to ensure safety.
# You might also need to clear bash history to avoid leaking secrets.
unset DBPASSWORD
unset PRIVATE_KEY

