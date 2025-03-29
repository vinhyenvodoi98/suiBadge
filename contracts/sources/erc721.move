module sui_badge::erc721 {
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::vec_set::{Self, VecSet};
    use sui::event;
    use std::vector;

    /// Error codes
    const EInvalidRecipients: u64 = 1;

    public struct NFT has key, store {
        id: UID,
        name: string::String,
        description: string::String,
        image_url: string::String,
    }

    public struct MintEvent has copy, drop {
        nft_id: ID,
        recipient: address,
    }

    /// Mint an NFT to the sender
    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: string::utf8(image_url),
        };
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    /// Mint NFTs to multiple recipients
    public entry fun mint_to_recipients(
        recipients: vector<address>,
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        // Verify recipients list is not empty
        assert!(vector::length(&recipients) > 0, EInvalidRecipients);

        let name_str = string::utf8(name);
        let description_str = string::utf8(description);
        let image_url_str = string::utf8(image_url);

        // Mint NFT for each recipient
        let mut i = 0;
        let len = vector::length(&recipients);
        while (i < len) {
            let recipient = *vector::borrow(&recipients, i);
            
            let nft = NFT {
                id: object::new(ctx),
                name: string::utf8(string::into_bytes(name_str)),
                description: string::utf8(string::into_bytes(description_str)),
                image_url: string::utf8(string::into_bytes(image_url_str)),
            };

            // Emit mint event
            event::emit(MintEvent {
                nft_id: object::id(&nft),
                recipient,
            });

            transfer::public_transfer(nft, recipient);
            i = i + 1;
        };
    }

    public entry fun transfer(nft: NFT, recipient: address, _: &mut TxContext) {
        transfer::public_transfer(nft, recipient);
    }

    public entry fun burn(nft: NFT, _: &mut TxContext) {
        let NFT { id, name:_, description:_, image_url:_ } = nft;
        object::delete(id);
    }

    public fun name(nft: &NFT): string::String {
       nft.name
    }

    public fun uri(nft: &NFT): string::String {
        nft.image_url
    }

    public fun description(nft: &NFT): string::String {
        nft.description
    }
}
