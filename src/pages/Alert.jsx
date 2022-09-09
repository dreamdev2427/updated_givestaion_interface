import React from 'react'

export default function Alert({type, content, title, onClose, timeout = 1000 }) {
    // const [alert, setAlert] = useState(false);
    const onClickClose = () => {
        onClose();
    }

    return (
        <section className="alert fixed top-5 right-3 z-50">
            { type === "success" && 
                <div className="alert-box relative alert-success-two p-3 flex items-center justify-center ml-2 my-6">
                    <div className="alert-icon absolute left-6 -top-10"><img src="/images/success-one.png" alt="alert" /></div>
                    <div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/green-bubbles.png" alt="bubble" /></div>
                    <div className="content">
                        <div className='inner-content'>
                            <h4 className='alert-title text-white text-md'>{title}</h4>
                            <p className='text-xs text-white'>{content}</p>
                        </div>
                    </div>
                    <div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
                </div>
            }
            { type === "error" && 
            <div className="alert-box relative alert-fail-two p-3 flex items-center justify-center ml-2 my-6">
                <div className="alert-icon absolute left-6 -top-10"><img src="/images/fail-one.png" alt="alert" /></div>
                <div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/red-bubbles.png" alt="bubble" /></div>
                <div className="content">
                    <div className='inner-content'>
                        <h4 className='alert-title text-white text-md'>{title}</h4>
                        <p className='text-xs text-white'>{content}</p>
                    </div>
                </div>
                <div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
            </div>
            }
            {   type === "warning" && 
            <div className="alert-box relative alert-warning-two p-3 flex items-center justify-center ml-2 my-6">
                <div className="alert-icon absolute left-6 -top-10"><img src="/images/warning-one.png" alt="alert" /></div>
                <div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/yellow-bubbles.png" alt="bubble" /></div>
                <div className="content">
                    <div className='inner-content'>
                        <h4 className='alert-title text-white text-md'>{title}</h4>
                        <p className='text-xs text-white'>{content}</p>
                    </div>
                </div>
                <div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
            </div>
            }
            { type === "information" && 
            <div className="alert-box relative alert-help-two p-3 flex items-center justify-center ml-2 my-6">
                <div className="alert-icon absolute left-6 -top-10"><img src="/images/help-one.png" alt="alert" /></div>
                <div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/blue-bubbles.png" alt="bubble" /></div>
                <div className="content">
                    <div className='inner-content'>
                        <h4 className='alert-title text-white text-md'>{title}</h4>
                        <p className='text-xs text-white'>{content}</p>
                    </div>
                </div>
                <div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
            </div>
            }
        </section>
    )
}

///////////////////////////////////////////////////////////////////////////////////////
/*
//alert type two
<div className="alert-box relative alert-success-three p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/success-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/green-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Well done!</h4>
        <p className='text-xs text-white'>You successfully read this important message.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-fail-three p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/fail-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/red-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Oh snap!</h4>
        <p className='text-xs text-white'>Change a few things up and try submitting again.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-warning-three p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/warning-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/yellow-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Warning!</h4>
        <p className='text-xs text-white'>Sorry! There was a problem with your request.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-help-three p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/help-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/blue-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Hi there!</h4>
        <p className='text-xs text-white'>Do you have a problem? Just use this contact form.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
/// alert type four 
<div className="alert-box relative alert-success-four p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/success-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/green-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Well done!</h4>
        <p className='text-xs text-white'>You successfully read this important message.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-fail-four p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/fail-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/red-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Oh snap!</h4>
        <p className='text-xs text-white'>Change a few things up and try submitting again.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-warning-four p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/warning-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/yellow-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Warning!</h4>
        <p className='text-xs text-white'>Sorry! There was a problem with your request.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-help-four p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/help-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/blue-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Hi there!</h4>
        <p className='text-xs text-white'>Do you have a problem? Just use this contact form.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
/// alert type five
<div className="alert-box relative alert-success-five p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/success-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/green-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Well done!</h4>
        <p className='text-xs text-white'>You successfully read this important message.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-fail-five p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/fail-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/red-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Oh snap!</h4>
        <p className='text-xs text-white'>Change a few things up and try submitting again.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-warning-five p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/warning-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/yellow-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Warning!</h4>
        <p className='text-xs text-white'>Sorry! There was a problem with your request.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-help-five p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/help-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/blue-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Hi there!</h4>
        <p className='text-xs text-white'>Do you have a problem? Just use this contact form.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
/// alert type six
<div className="alert-box relative alert-success-six p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/success-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/green-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Well done!</h4>
        <p className='text-xs text-white'>You successfully read this important message.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-fail-six p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/fail-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/red-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Oh snap!</h4>
        <p className='text-xs text-white'>Change a few things up and try submitting again.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-warning-six p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/warning-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/yellow-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Warning!</h4>
        <p className='text-xs text-white'>Sorry! There was a problem with your request.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
<div className="alert-box relative alert-help-six p-3 flex items-center justify-center ml-2 my-6">
<div className="alert-icon absolute left-6 -top-10"><img src="/images/help-one.png" alt="alert" /></div>
<div className="alert-icon-bottom absolute left-0 bottom-0 overflow-hidden"><img className='bubble' src="/images/blue-bubbles.png" alt="bubble" /></div>
<div className="content">
    <div className='inner-content'>
        <h4 className='alert-title text-white text-md'>Hi there!</h4>
        <p className='text-xs text-white'>Do you have a problem? Just use this contact form.</p>
    </div>
</div>
<div className="close-icon" onClick={onClickClose}><img src="/images/close.png" alt="close" className='absolute right-8 top-3' /></div>
</div>
*/

//////////////////////////////////////////////////////////////////////////////////////