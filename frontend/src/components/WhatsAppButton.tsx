import WhatsAppIcon from "../assets/whatsapp.png"

const WhatsAppButton = ({ mobile_no }: { mobile_no?: string }) => {
    return (
        <a target='_blank' href={`https://wa.me/${mobile_no?.replace(/\D/g, '')}`} className='btn btn-icon border border-base-300 btn-sm'>
            <img src={WhatsAppIcon} className='h-6' alt="" />
            {mobile_no}
        </a>
    );
}

export default WhatsAppButton