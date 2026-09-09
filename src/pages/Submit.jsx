function Submit({loading}) {
    return <button id="addbtn" 
    type="submit"
    disabled={loading}>
    {loading ? "Submitting..." : "Add" }
    </button>;
}

export default Submit