#[starknet::interface]
pub trait IBounty<TContractState> {
    fn bounty(
        ref self: TContractState,
        value: u64,
        name: felt252,
        start_date: u64,
        end_date: u64,
    );

    fn get_bounty_value(self: @TContractState, index: u64) -> u64;
    fn get_bounty_name(self: @TContractState, index: u64) -> felt252;
    fn get_bounty_start_date(self: @TContractState, index: u64) -> u64;
    fn get_bounty_end_date(self: @TContractState, index: u64) -> u64;
}

#[starknet::contract]
mod Bounty {
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        balance: felt252,
        start_date: u64,
        end_date: u64,
        bounties: LegacyMap::<u64, BountyInfo>,
        bounty_count: u64,
        /// TODO: Implement saving for approved addresses
        /// approved_addresses: LegacyMap::<ContractAddress, bool>,

    }

    #[derive(Drop, Serde, starknet::Store)]
    struct BountyInfo {
        value: u64,
        name: felt252,
        start_date: u64,
        end_date: u64,
        /// Save creator address which is the address to the owner of the bounty
        /// creator: ContractAddress,

    }

    #[abi(embed_v0)]
    impl BountyImpl of super::IBounty<ContractState> {
        fn bounty(
            ref self: ContractState,
            value: u64,
            name: felt252,
            start_date: u64,
            end_date: u64,
        ) {
            let index = self.bounty_count.read();
            let bounty_info = BountyInfo {
                value: value,
                name: name,
                start_date: start_date,
                end_date: end_date,
            };
            self.bounties.write(index, bounty_info);
            self.bounty_count.write(index + 1);
            /// self.approved_addresses.write(creator, true);

        }

        fn get_bounty_value(self: @ContractState, index: u64) -> u64 {
            let bounty_info = self.bounties.read(index);
            bounty_info.value
        }

        fn get_bounty_name(self: @ContractState, index: u64) -> felt252 {
            let bounty_info = self.bounties.read(index);
            bounty_info.name
        }

        fn get_bounty_start_date(self: @ContractState, index: u64) -> u64 {
            let bounty_info = self.bounties.read(index);
            bounty_info.start_date
        }

        fn get_bounty_end_date(self: @ContractState, index: u64) -> u64 {
            let bounty_info = self.bounties.read(index);
            bounty_info.end_date
        }

        /// TODO: Fix logic for getting the approved_addresses
        /// fn get_approved_addresses(self: @ContractState) -> Array<ContractAddress> {
        /// let mut approved_addresses = ArrayTrait::new();
        ///     let approved_addresses_iter = self.approved_addresses.iter();
        ///     for (address, _) in approved_addresses_iter {
        ///         approved_addresses.append(address);
        ///     }
        /// }
    }
}