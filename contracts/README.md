## Build

```bash
sui move build
```

### Run testcase

```bash
sui move test
```

### Publish Contract

To publish the contract to the network:

```bash
sui client publish /Users/do.duc.hoang/Desktop/Hackathon/sui/SuiBadge/contracts --gas-budget 1000000000
```

After successful publishing, you'll get a Package ID. Save this ID as you'll need it to interact with the contract.

### Call Contract Function

To mint a Hello World object:

```bash
sui client call --package <PACKAGE_ID> --module hello_world --function mint_hello_world
```

Replace `<PACKAGE_ID>` with your deployed package ID. For example:
```bash
sui client call --package 0xf95a775a2b08523a01fa93d4ebc67b04c1fb021045806e26dca29293dca942b0 --module hello_world --function mint_hello_world
```

Note: The package ID will be different each time you publish the contract. Always use the most recent package ID from your latest publish transaction.

