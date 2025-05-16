use anchor_lang::prelude::*;

declare_id!("HA3v3eTLGokEfZU7acnJGn94Xv5TiRD8GBV4zr885JDj");

#[program]
pub mod bnpl_kyc {
    use super::*;

    pub fn store_user_kyc(
        ctx: Context<StoreUserKyc>,
        name: String,
        email: String,
        mobile: String,
        gov_id: String,
        face_verified: bool,
    ) -> Result<()> {
        let user_data = &mut ctx.accounts.user_data;

        user_data.authority = *ctx.accounts.authority.key;
        user_data.name = name;
        user_data.email = email;
        user_data.mobile = mobile;
        user_data.gov_id = gov_id;
        user_data.face_verified = face_verified;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, email: String, mobile: String, gov_id: String)]
pub struct StoreUserKyc<'info> {
    #[account(
        init, 
        payer = authority, 
        space = 8 + UserKycData::LEN,
        seeds = [b"user_kyc", authority.key().as_ref()],
        bump
    )]
    pub user_data: Account<'info, UserKycData>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct UserKycData {
    pub authority: Pubkey,
    pub name: String,
    pub email: String,
    pub mobile: String,
    pub gov_id: String,
    pub face_verified: bool,
}

impl UserKycData {
    pub const LEN: usize = 
        32 +               // authority
        4 + 100 +          // name (max 100 chars)
        4 + 100 +          // email (max 100 chars)
        4 + 20 +           // mobile (max 20 digits)
        4 + 50 +           // gov_id (max 50 chars)
        1;                 // face_verified (bool)
}

