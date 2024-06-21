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
        total_paid: u128,
        is_active: bool,
    }

    // Struct to store bug information
    #[derive(Drop, Serde, starknet::Store)]
    struct BugInfo {
        bounty_id: u64,
        hacker_address: ContractAddress,
        severity: u8, // 0: Low, 1: Medium, 2: High
        status: u8, // 0: Pending, 1: Approved, 2: Denied
        reward: u128,
        submission_date: u64,
        bug_id: u32,
    }
    
    // Contract storage
    #[storage]
    struct Storage {
        owner: ContractAddress,
        bounty_count: u64,
        bounties: LegacyMap::<u64, BountyInfo>,
        bug_count: LegacyMap::<u64, u64>,
        bugs: LegacyMap::<(u64, u64), BugInfo>,
        staked_amounts: LegacyMap::<ContractAddress, u128>,
        staked_teams: LegacyMap::<ContractAddress, bool>,
        total_staked: u128,
        user_rewards: LegacyMap::<ContractAddress, u128>,
    }

    // Contract interface
    #[starknet::interface]
    trait IBounty<TContractState> {
        // Create a new bounty
        fn create_bounty(ref self: TContractState, name: felt252, start_date: u64, end_date: u64, max_reward: u128) -> u64;
        
        // Submit a bug for a bounty
        fn submit_bug(ref self: TContractState, bounty_id: u64, bug_id: u32);
        
        // Approve a bug and set its severity
        fn approve_bug(ref self: TContractState, bounty_id: u64, bug_index: u64, severity: u8, reward: u128);
        
        // Deny a bug
        fn deny_bug(ref self: TContractState, bounty_id: u64, bug_index: u64, reason: felt252);
        
        // Get a bounty by its ID
        fn get_bounty(self: @TContractState, bounty_id: u64) -> BountyInfo;
        
        // Get a bug by its bounty ID and index
        fn get_bug(self: @TContractState, bounty_id: u64, bug_index: u64) -> BugInfo;
        
        // Stake an amount
        fn stake(ref self: TContractState) -> bool;
        
        // Unstake an amount
        fn unstake(ref self: TContractState, address: ContractAddress) -> bool;
        
        // Slash a team's stake
        fn slash_team_stake(ref self: TContractState, team_address: ContractAddress);
        
        // Get all staked addresses
        fn get_all_staked(self: @TContractState) -> Array<ContractAddress>;
        
        // Check if a single address is staked
        fn is_staked(self: @TContractState, address: ContractAddress) -> bool;
        
        // Get the name and index of each bounty (read-only)
        fn get_name_bounty(self: @TContractState) -> Array<(felt252, u64)>;
        
        // Withdraw your rewards
        fn withdraw_rewards(ref self: TContractState);
        
        // Update a bounty
        fn update_bounty(ref self: TContractState, bounty_id: u64, name: felt252, end_date: u64, max_reward: u128);
        
        // Get total rewards paid out
        fn get_total_rewards(self: @TContractState, address: ContractAddress) -> u128;
    }

    // Contract constructor
    #[constructor]
    fn constructor(ref self: ContractState) {
        // TODO: Set owner the right way
        self.owner.write(starknet::get_caller_address());
    }

    // Contract implementation
    #[abi(embed_v0)]
    impl BountyImpl of IBounty<ContractState> {
        // Create a new bounty
        fn create_bounty(
            ref self: ContractState,
            name: felt252,
            start_date: u64,
            end_date: u64,
            max_reward: u128
        ) -> u64 {
            let caller = get_caller_address();
            assert!(self.is_staked(caller), "Caller must be staked");

            let bounty_id = self.bounty_count.read();
            let bounty_info = BountyInfo {
                name,
                start_date,
                end_date,
                max_reward,
                team_address: caller,
                total_paid: 0,
                is_active: true,
            };
            
            self.bounties.write(bounty_id, bounty_info);
            self.bounty_count.write(bounty_id + 1);
            bounty_id
        }

        // Submit a bug for a bounty
        fn submit_bug(ref self: ContractState, bounty_id: u64, bug_id: u32) {
            let caller = get_caller_address();
            let bounty = self.bounties.read(bounty_id);
            assert!(bounty.is_active, "Bounty is not active");
            // assert!(get_block_timestamp() <= bounty.end_date, "Bounty has ended");

            let bug_count = self.bug_count.read(bounty_id);
            
            let bug_info = BugInfo {
                bounty_id,
                hacker_address: caller,
                severity: 0,
                status: 0,
                reward: 0,
                submission_date: 0,
                bug_id,
            };
            
            self.bugs.write((bounty_id, bug_count), bug_info);
            self.bug_count.write(bounty_id, bug_count + 1);
        }

        // Approve a bug and set its severity
        fn approve_bug(
            ref self: ContractState,
            bounty_id: u64,
            bug_index: u64,
            severity: u8,
            reward: u128
        ) {
            let caller = get_caller_address();
            let mut bounty_info = self.bounties.read(bounty_id);
            assert!(caller == bounty_info.team_address, "Only bounty creator can approve");
            
            let mut bug_info = self.bugs.read((bounty_id, bug_index));
            assert!(bug_info.status == 0, "Bug must be in pending status");
            assert!(reward <= bounty_info.max_reward, "Reward exceeds max reward");

            bug_info.status = 1;
            bug_info.severity = severity;
            bug_info.reward = reward;
            self.bugs.write((bounty_id, bug_index), bug_info);

            // bounty.total_paid += reward;
            // self.bounties.write(bounty_id, bounty);

            // let hacker_rewards = self.user_rewards.read(bug.hacker_address);
            // self.user_rewards.write(bug.hacker_address, hacker_rewards + reward);
        }
        
        // Deny a bug (with reason)
        fn deny_bug(ref self: ContractState, bounty_id: u64, bug_index: u64, reason: felt252) {
            let caller = get_caller_address();
            let bounty = self.bounties.read(bounty_id);
            assert!(caller == bounty.team_address, "Only bounty creator can deny");
            
            let mut bug = self.bugs.read((bounty_id, bug_index));
            assert!(bug.status == 0, "Bug must be in pending status");

            bug.status = 2;
            // Store denial reason (you might want to add this field to BugInfo)
            self.bugs.write((bounty_id, bug_index), bug);
        }
        
        // Get a bounty by its ID
        fn get_bounty(self: @ContractState, bounty_id: u64) -> BountyInfo {
            self.bounties.read(bounty_id)
        }

        // Get a bug by its bounty ID and index
        fn get_bug(self: @ContractState, bounty_id: u64, bug_index: u64) -> BugInfo {
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
        fn is_staked(self: @ContractState, address: ContractAddress) -> bool {
            self.staked_teams.read(address)
        }

        // Get the name and index of each bounty
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

        
        // Withdraw funds
        fn withdraw_rewards(ref self: ContractState) {
            let caller = get_caller_address();
            let rewards = self.user_rewards.read(caller);
            assert!(rewards > 0, "No rewards to withdraw");
            self.user_rewards.write(caller, 0);
            // Transfer rewards to caller (TODO: implement actual transfer logic)
        }

        // Update a bounty
        fn update_bounty(
            ref self: ContractState,
            bounty_id: u64,
            name: felt252,
            end_date: u64,
            max_reward: u128
        ) {
            let caller = get_caller_address();
            let mut bounty = self.bounties.read(bounty_id);
            assert!(caller == bounty.team_address, "Only bounty creator can update");
            assert!(bounty.is_active, "Cannot update inactive bounty");

            bounty.name = name;
            bounty.end_date = end_date;
            bounty.max_reward = max_reward;
            self.bounties.write(bounty_id, bounty);
        }

        // Get a total reward for one user
        fn get_total_rewards(self: @ContractState, address: ContractAddress) -> u128 {
            self.user_rewards.read(address)
        }
    }
}