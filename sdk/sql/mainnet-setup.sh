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
var=$(ISTESTNET=0 PRIVATE_KEY=$PRIVATE_KEY KEY=$KEY CLIPASSWORD=$CLIPASSWORD node keygen.js)
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
    'ca32432b-e5a9-4bae-acb0-3f3492c69754',
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
    '3100c73f-2e54-4b19-ade5-7d58805fcac6',
    'LIT NETWORK BEP2',
    'LIT',
    'LIT-099',
    1450613134506131,
    '0x763fa6806e1acf68130d2d0f0df754c93cc546b2',
    false,
    100,
    5,
    'eth-uuid-optional-mainnet',
    'ca32432b-e5a9-4bae-acb0-3f3492c69754',
    true,
    true,
    'listing-proposal-uuid-mainnet',
    true,
    now()
  );
"


set -o history

# You should keep your own copy of the following secrets. unset to ensure safety.
# You might also need to clear bash history to avoid leaking secrets.
unset DBPASSWORD
unset PRIVATE_KEY

