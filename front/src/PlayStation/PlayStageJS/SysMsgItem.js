import React from 'react';

const SysMsgItem = ({data}) => {
    return (
        <div className="stage-chat-item stage-sysmsg-item">
            &gt;&gt; {data.nick ? data.nick : "손"}{data.msg}
        </div>
    );
};

export default SysMsgItem;