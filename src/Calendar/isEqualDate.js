export const isEqualDate = (date1, date2)=>{
    const isEqueal = date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
    return isEqueal
}
