use starknet::ContractAddress;
use starknet::contract_address_const;
use starknet::get_caller_address;

#[starknet::contract]
mod Bounty {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    // use starknet::get_block_timestamp;

    // Struct to store bounty information
    #[derive(Drop, Serde, starknet::Store)]
    struct BountyInfo {
        name: felt252,
        start_date: u64,
        end_date: u64,
        max_reward: u128,
        team_address: ContractAddress,
    }

    // Struct to store bug information
    #[derive(Drop, Serde, starknet::Store)]
    struct BugInfo {
        bounty_id: u64,
        bug_id: u32,
        hacker_address: ContractAddress,
        severity: felt252,
        approved: bool,
    }
    
    // Contract storage
    #[storage]
    struct Storage {
        bounties: LegacyMap::<u64, BountyInfo>,
        bounty_count: u64,
        bugs: LegacyMap::<(u64, u64), BugInfo>,
        bug_count: LegacyMap::<u64, u64>,
        staked_teams: LegacyMap::<ContractAddress, bool>,
        owner: ContractAddress,
        balance: u64,
    }

    // Contract interface
    #[starknet::interface]
    trait IBounty<TContractState> {
        // Create a new bounty
        fn create_bounty(
            ref self: TContractState,
            name: felt252,
            start_date: u64,
            end_date: u64,
            max_reward: u128,
        );

        // Submit a bug for a bounty
        fn submit_bug(ref self: TContractState, bounty_id: u64, bug_id: u32);
        
        // Approve a bug and set its severity
        fn approve_bug(ref self: TContractState, bounty_id: u64, bug_index: u64, severity: felt252);
        
        // Deny a bug
        fn deny_bug(ref self: TContractState, bounty_id: u64, bug_index: u64);
        
        // Get a bounty by its ID
        fn get_bounty(self: @TContractState, bounty_id: u64) -> BountyInfo;
        
        // Get a bug by its bounty ID and index
        fn get_bug(self: @TContractState, bounty_id: u64, bug_index: u64) -> BugInfo;
        
        // Slash a team's stake
        fn slash_team_stake(ref self: TContractState, team_address: ContractAddress);
        
        // Stake an amount
        fn stake(ref self: TContractState) -> bool;

        // Check if a single address is staked
        fn is_staked(self: @TContractState, address: ContractAddress) -> bool;
        
        // Unstake an amount
        fn unstake(ref self: TContractState, address: ContractAddress) -> bool;
        
        // Get all staked addresses
        fn get_all_staked(self: @TContractState) -> Array<ContractAddress>;

        // Get the name and index of each bounty (read-only)
        fn get_name_bounty(self: @TContractState) -> Array<(felt252, u64)>;

        
        // Get the current timestamp
        // fn get_timestamp(ref self: TContractState, address: ContractAddress) -> u64;
    }

    // Contract constructor
    #[constructor]
    fn constructor(ref self: ContractState) {
        self.owner.write(starknet::get_caller_address());
    }

    // Contract implementation
    #[abi(embed_v0)]
    impl BountyImpl of IBounty<ContractState> {
        // Create a new bounty
        fn create_bounty(ref self: ContractState, name: felt252, start_date: u64, end_date: u64, max_reward: u128) {
            // Check if the caller is staked
            let caller = get_caller_address();
            assert!(self.is_staked(caller));

            // Get the next bounty ID
            let bounty_id = self.bounty_count.read();
            
            // Create a new bounty info
            let bounty_info = BountyInfo {
                name,
                start_date,
                end_date,
                max_reward,
                team_address: caller,
            };
            
            // Add the bounty to storage
            self.bounties.write(bounty_id, bounty_info);
            
            // Increment the bounty count
            self.bounty_count.write(bounty_id + 1);
        }

        // Submit a bug for a bounty
        fn submit_bug(ref self: ContractState, bounty_id: u64, bug_id: u32) {
            let caller = get_caller_address();
            let bug_count = self.bug_count.read(bounty_id);
            let bug_index = bug_count;
            let bug_info = BugInfo {
                bounty_id,
                hacker_address: caller,
                severity: 0,
                approved: false,
                bug_id,
            };
            self.bugs.write((bounty_id, bug_index), bug_info);
            self.bug_count.write(bounty_id, bug_count + 1);
        }

        // Approve a bug and set its severity
        fn approve_bug(ref self: ContractState, bounty_id: u64, bug_index: u64, severity: felt252) {
            let caller: ContractAddress = get_caller_address();
            let bounty_info = self.bounties.read(bounty_id);
            assert!(caller == bounty_info.team_address);
            let mut bug_info = self.bugs.read((bounty_id, bug_index));
            assert!(!bug_info.approved);
            bug_info.severity = severity;
            bug_info.approved = true;
            self.bugs.write((bounty_id, bug_index), bug_info);
        }

        // Deny a bug
        fn deny_bug(ref self: ContractState, bounty_id: u64, bug_index: u64) {
            let caller = get_caller_address();
            let bounty_info = self.bounties.read(bounty_id);
            assert!(caller != bounty_info.team_address);
            let mut bug_info = self.bugs.read((bounty_id, bug_index));
            assert!(bug_info.approved);
            bug_info.approved = false;
            self.bugs.write((bounty_id, bug_index), bug_info);
        }

        // Get a bounty by its ID
        fn get_bounty(self: @ContractState, bounty_id: u64) -> BountyInfo {
            self.bounties.read(bounty_id)
        }

        // Get a bug by its bounty ID and index
        fn get_bug(self: @ContractState, bounty_id: u64, bug_index: u64) -> BugInfo {
            let caller = get_caller_address();
            let bounty_info = self.bounties.read(bounty_id);
            assert!(caller == bounty_info.team_address);
            self.bugs.read((bounty_id, bug_index))
        }

        // Stake an amount
        fn stake(ref self: ContractState) -> bool {
            let caller = starknet::get_caller_address();
            self.staked_teams.write(caller, true);
            true
        }
        
        // Slash a team's stake
        fn slash_team_stake(ref self: ContractState, team_address: ContractAddress) {
            let caller = starknet::get_caller_address();
            assert!(caller != self.owner.read());
            assert!(!self.is_staked(team_address));
            self.unstake(team_address);
        }

        // Unstake an amount
        fn unstake(ref self: ContractState, address: ContractAddress) -> bool {
            assert!(self.staked_teams.read(address));
            self.staked_teams.write(address, false);
            true
        }

        // Get all staked addresses
        fn get_all_staked(self: @ContractState) -> Array<ContractAddress> {
            let mut result: Array<ContractAddress> = ArrayTrait::new();
            let bounty_count = self.bounty_count.read();
            
            let mut i: u64 = 0;
            loop {
                if i >= bounty_count {
                    break;
                }
                let bounty_info = self.bounties.read(i);
                let team_address = bounty_info.team_address;
                if self.staked_teams.read(team_address) {
                    result.append(team_address);
                }
                i += 1;
            };
            
            result
        }

        // Check if an address is staked
        fn get_staked(ref self: ContractState, address: ContractAddress) -> bool {
            self.staked_teams.read(address)
        }

        fn get_name_bounty(self: @ContractState) -> Array<(felt252, u64)> {
            let mut result: Array<(felt252, u64)> = ArrayTrait::new();
            let bounty_count = self.bounty_count.read();
            
            let mut i: u64 = 0;
            loop {
                if i >= bounty_count {
                    break;
                }
                let bounty_info = self.bounties.read(i);
                result.append((bounty_info.name, i));
                i += 1;
            };
            
            result
        }
    }
}