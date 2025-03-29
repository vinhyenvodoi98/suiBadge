module examples::erc721 {
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    public struct NFT has key, store {
        id: UID,
        name: string::String,
        description: string::String,
        image_url: string::String,
        symbol: string::String,
    }

    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        symbol: vector<u8>,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: string::utf8(image_url),
            symbol: string::utf8(symbol),
        };
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    public entry fun transfer(nft: NFT, recipient: address, _: &mut TxContext) {
        transfer::public_transfer(nft, recipient);
    }

    public entry fun burn(nft: NFT, _: &mut TxContext) {
        let NFT { id, name:_, description:_, image_url:_, symbol:_ } = nft;
        object::delete(id);
    }

    public fun name(nft: &NFT): string::String {
       nft.name
    }

    public fun symbol(nft: &NFT): string::String {
        nft.symbol
    }

    public fun uri(nft: &NFT): string::String {
        nft.image_url
    }

    public fun description(nft: &NFT): string::String {
        nft.description
    }
}
