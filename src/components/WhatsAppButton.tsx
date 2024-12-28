import WhatsAppIcon from "../assets/whatsapp.png"

const WhatsAppButton = ({ mobile_no, icon_only }: { mobile_no?: string, icon_only?: boolean }) => {
    if(mobile_no?.length == 0) return (
        <button className='btn btn-icon border border-base-300 btn-xs'>No Number</button>
    )
    return (
        <a target='_blank' href={`https://wa.me/${mobile_no?.replace(/\D/g, '')}`} className='btn btn-icon border border-base-300 btn-sm'>
            <img src={WhatsAppIcon} className='h-6' alt="" />
            {!icon_only && mobile_no}
        </a>
    );
}

export default WhatsAppButton