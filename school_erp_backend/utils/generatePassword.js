const generatePassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const digits = '23456789';
    const special = '@#$!';

    const rand = (str) => str[Math.floor(Math.random() * str.length)];

    // Ensure at least one of each type
    const base = rand(upper) + rand(lower) + rand(digits) + rand(special);
    const extra = Array.from({ length: 6 }, () =>
        rand(upper + lower + digits)
    ).join('');

    // Shuffle
    return (base + extra).split('').sort(() => Math.random() - 0.5).join('');
};

module.exports=generatePassword;